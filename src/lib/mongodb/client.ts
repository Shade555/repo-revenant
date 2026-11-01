import { MongoClient, Db } from 'mongodb';
import { DossierReport, SeanceMessage } from '@/types';
import { SAMPLE_DOSSIERS } from '@/lib/sample-data';

// In-Memory store for zero-config local development
const inMemoryInvestigations: Map<string, DossierReport> = new Map();
const inMemoryConversations: Map<string, SeanceMessage[]> = new Map();

// Pre-load sample dossiers into memory
Object.values(SAMPLE_DOSSIERS).forEach((d) => {
  inMemoryInvestigations.set(d.id, d);
  inMemoryInvestigations.set(`${d.owner}/${d.name}`.toLowerCase(), d);
});

let client: MongoClient | null = null;
let clientPromise: Promise<MongoClient> | null = null;

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DATABASE || 'repo_revenant';

export function isMongoConfigured(): boolean {
  return Boolean(uri && uri.trim().length > 0);
}

export async function getDatabase(): Promise<Db | null> {
  if (!isMongoConfigured()) {
    return null;
  }

  try {
    if (!clientPromise) {
      client = new MongoClient(uri!);
      clientPromise = client.connect();
    }
    const connectedClient = await clientPromise;
    return connectedClient.db(dbName);
  } catch (err) {
    console.warn('MongoDB connection failed; falling back to in-memory store:', err);
    return null;
  }
}

/**
 * Persist an Investigation Dossier Report
 */
export async function saveInvestigation(dossier: DossierReport): Promise<boolean> {
  // Always save in-memory for instant availability
  inMemoryInvestigations.set(dossier.id, dossier);
  inMemoryInvestigations.set(`${dossier.owner}/${dossier.name}`.toLowerCase(), dossier);

  const db = await getDatabase();
  if (!db) return true; // In-memory success

  try {
    const investigations = db.collection('investigations');
    await investigations.updateOne(
      { id: dossier.id },
      { $set: { ...dossier, updatedAt: new Date().toISOString() } },
      { upsert: true }
    );

    // Also persist evidence items into repositoryEvidence collection
    if (dossier.evidenceLedger && dossier.evidenceLedger.length > 0) {
      const evidenceCol = db.collection('repositoryEvidence');
      for (const ev of dossier.evidenceLedger) {
        await evidenceCol.updateOne(
          { id: ev.id, dossierId: dossier.id },
          { $set: { ...ev, dossierId: dossier.id, repo: `${dossier.owner}/${dossier.name}` } },
          { upsert: true }
        );
      }
    }

    // Persist agent executions
    if (dossier.executionRecords && dossier.executionRecords.length > 0) {
      const executionsCol = db.collection('agentExecutions');
      for (const exec of dossier.executionRecords) {
        await executionsCol.insertOne({
          ...exec,
          dossierId: dossier.id,
          repo: `${dossier.owner}/${dossier.name}`,
          recordedAt: new Date().toISOString(),
        });
      }
    }

    return true;
  } catch (err) {
    console.error('Failed to save investigation to MongoDB:', err);
    return false;
  }
}

/**
 * Retrieve an Investigation Dossier Report by ID or owner/repo
 */
export async function getInvestigation(identifier: string): Promise<DossierReport | null> {
  const cleanId = identifier.trim().toLowerCase();

  // Check in-memory store first
  if (inMemoryInvestigations.has(cleanId)) {
    return inMemoryInvestigations.get(cleanId)!;
  }

  // Check MongoDB
  const db = await getDatabase();
  if (!db) {
    // Try matching by id or name in memory
    for (const d of inMemoryInvestigations.values()) {
      if (d.id.toLowerCase() === cleanId || d.name.toLowerCase() === cleanId || `${d.owner}/${d.name}`.toLowerCase() === cleanId) {
        return d;
      }
    }
    return null;
  }

  try {
    const investigations = db.collection('investigations');
    const doc = await investigations.findOne({
      $or: [
        { id: identifier },
        { repoUrl: { $regex: cleanId, $options: 'i' } },
        { name: cleanId },
      ],
    });

    if (doc) {
      delete (doc as { _id?: unknown })._id;
      return doc as unknown as DossierReport;
    }
  } catch (err) {
    console.error('Failed to query investigation from MongoDB:', err);
  }

  return null;
}

/**
 * Save a Séance Message
 */
export async function saveSeanceMessage(dossierId: string, message: SeanceMessage): Promise<void> {
  const existing = inMemoryConversations.get(dossierId) || [];
  existing.push(message);
  inMemoryConversations.set(dossierId, existing);

  const db = await getDatabase();
  if (!db) return;

  try {
    const messagesCol = db.collection('messages');
    await messagesCol.insertOne({
      ...message,
      dossierId,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to persist séance message to MongoDB:', err);
  }
}

/**
 * Get Séance Conversation for a Dossier
 */
export async function getSeanceConversation(dossierId: string): Promise<SeanceMessage[]> {
  const inMem = inMemoryConversations.get(dossierId);
  if (inMem && inMem.length > 0) return inMem;

  const db = await getDatabase();
  if (!db) return [];

  try {
    const messagesCol = db.collection('messages');
    const docs = await messagesCol.find({ dossierId }).sort({ createdAt: 1 }).toArray();
    return docs.map((doc) => {
      delete (doc as { _id?: unknown })._id;
      return doc as unknown as SeanceMessage;
    });
  } catch (err) {
    console.error('Failed to fetch conversation from MongoDB:', err);
    return [];
  }
}
