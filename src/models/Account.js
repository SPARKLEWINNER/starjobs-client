const mongoose = require('mongoose');
const { Schema, Types } = mongoose;
const collectionName = 'account';
const accountSchema = new Schema(
    {
        uuid: { type: Types.ObjectId, ref: 'User' },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        middleInitial: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        citizenship: {
            type: String,
            required: true
        },
        civilStatus: {
            type: String,
            required: true
        },
        religion: {
            type: String,
            required: true
        },
        permanentBlkNo: {
            type: String,
            required: true
        },
        permanentCity: {
            type: String,
            required: true
        },
        permanentStreetName: {
            type: String,
            required: true
        },
        permanentZipCode: {
            type: String,
            required: true
        },
        presentBlkNo: {
            type: String,
            required: true
        },
        presentCity: {
            type: String,
            required: true
        },
        presentStreetName: {
            type: String,
            required: true
        },
        presentZipCode: {
            type: String,
            required: true
        },
        emergencyContact: {
            type: String,
            required: true
        },
        emergencyName: {
            type: String,
            required: true
        },
        emergencyRelation: {
            type: String,
            required: true
        },
        work: {
            isCurrentWork: {
                type: String
            },
            isFreshGraduate: {
                type: String
            },
            currentCompany: {
                type: String,
                required: true
            },
            currentPosition: {
                type: String,
                required: true
            },
            currentStartDate: {
                type: String,
                required: true
            },
            currentEndDate: {
                type: String
            },
            currentPlaceOfWork: {
                type: String,
                required: true
            },
            pastCompany: {
                type: String,
            },
            pastPosition: {
                type: String,
            },
            pastStartDate: {
                type: String,
            },
            pastEndDate: {
                type: String,
            },
            pastPlaceOfWork: {
                type: String,
            }
        },
        expertise: {
            skillQualification: {
                type: String,
                required: true
            },
            skillOffer: {
                type: String,
                required: true
            },
            workType: {
                type: String
            },
            othersExpertise: {
                type: String
            }
        },
        education: {
            highSchoolName: {
                type: String
            },
            highSchoolYear: {
                type: String
            },
            highSchoolAwards: {
                type: String
            },
            collegeName: {
                type: String
            },
            collegeYear: {
                type: String
            },
            collegeAwards: {
                type: String
            },
            collegeDegree: {
                type: String
            },
            vocationalProgram: {
                type: String
            },
            vocationalYear: {
                type: String
            },
            vocationalAwards: {
                type: String
            }
        },
        rate: {
            rateAmount: String,
            rateType: String
        },
        payment: {
            accountPaymentType: {
                type: String
            },
            acccountPaymentName: {
                type: String
            },
            acccountPaymentNumber: {
                type: String
            }
        },
        dateCreated: {
            type: Date,
            required: true
        },
        photo: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Account', accountSchema, collectionName);
