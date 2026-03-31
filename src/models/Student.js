
const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  firstName: 
  { type: String, 
    required: true
   },
  lastName:
   { type: String,
     required: true 
    },
  studentCode:
   { type: String, 
    required: true, 
    unique: true
   }, 
  grade:
   { type: String, 
    required: true 
  },
  schoolId: 
  { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'School', 
    required: true 
  }
},
 { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
