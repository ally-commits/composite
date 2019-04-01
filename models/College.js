const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CollegeSchema = new Schema({
    clgName: {
        required: true,
        type: String,
    },
    teamName: {
        type: String
    },
    feedback: {
        type: Object
    },
    ice_breaker: {
        count: Number
    },
    vlog: {
        name:{
            type: String
        }
    },
    treasure_hunt: {
        name: {
            type: String
        }
    },
    it_manager: {
        name: {
            type: String
        }
    },
    gaming: {
        name1: {
            type: String
        },
        name2: {
            type: String
        }
    },
    coding: {
        name1: {
            type: String
        },
        name2: {
            type: String
        }
    },
    video_editing: {
        name: {
            type: String
        }
    },
    web_designing: {
        name: {
            type: String
        }
    },
    tech_talk : {
        name: {
            type: String
        }
    },
    it_quiz: {
        name1: {
            type: String
        },
        name2: {
            type: String
        }
    },
    meme: {
        name1: {
            type: String
        },
        name2: {
            type: String
        }
    },
    mad_ad: {
        name1: {
            type: String
        },
        name2 : {
            type: String
        },
        name3: {
            type: String
        },
        name4: {
            type: String
        },
        name5: {
            type: String
        }
    }
});

    
module.exports = College = mongoose.model('college',CollegeSchema);