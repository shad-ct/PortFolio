const mongoose = require('mongoose');
const fs = require('fs');
require('dotenv').config();
const { Peep } = require('./models');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB');
    const data = JSON.parse(fs.readFileSync('firestore_backup.txt', 'utf8'));
    
    await Peep.deleteMany({});
    console.log('Cleared existing peeps');
    
    const peepsToInsert = data.map(item => ({
      name: item.name,
      dob: item.dob,
      contact: item.contact,
      address: item.address
    }));
    
    await Peep.insertMany(peepsToInsert);
    console.log(`Inserted ${peepsToInsert.length} peeps`);
    
    mongoose.connection.close();
  })
  .catch(err => console.error(err));
