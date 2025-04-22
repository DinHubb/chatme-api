import { db } from "../config/db";

async function createSchema() {
  try {
    console.log("🚧 Creating tables...");

    // USERS
    await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      full_name VARCHAR(100),
      avatar_url TEXT,
      bio TEXT,
      msisdn VARCHAR(20),
      password_hash VARCHAR(255),
      lastseen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_online BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

    // CHATS (временно без внешних ключей на messages)
    await db.query(`
    CREATE TABLE IF NOT EXISTS chats (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255),
      avatar_url TEXT,
      last_message_id INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

    // MESSAGES
    await db.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      chat_id INT,
      sender_id INT,
      content TEXT,
      type ENUM('text', 'image', 'video', '
      audio', 'file', 'sticker', 'system') NOT NULL,
      media_url TEXT,
      replied_to_message_id INT,
      is_edited BOOLEAN DEFAULT false,
      sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      delivered_at TIMESTAMP NULL,
      FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (replied_to_message_id) REFERENCES messages(id) ON DELETE SET NULL
    )
  `);

    // ALTER CHATS
    await db.query(`
      ALTER TABLE chats
      ADD CONSTRAINT fk_last_message
        FOREIGN KEY (last_message_id) REFERENCES messages(id) ON DELETE SET NULL
    `);

    // CHAT PARTICIPANTS
    await db.query(`
    CREATE TABLE IF NOT EXISTS chat_participants (
      chat_id INT,
      user_id INT,
      is_muted BOOLEAN DEFAULT false,
      PRIMARY KEY (chat_id, user_id),
      FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

    console.log("✅ All tables created successfully.");
    process.exit();
  } catch (err) {
    console.error("❌ Error creating schema:", err);
    process.exit(1);
  }
}

createSchema();
