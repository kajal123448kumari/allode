import {Schema, model} from 'mongoose'
import shopModel from "./shopDetails";
const userSchema = new Schema({ shop: {
  type: mongoose.Schema.Types.ObjectId,
  ref: shopModel,
  required: true
},
    name: String,
    dob: String,
    firstname: String,
    lastname: String,
    organization: String,
    email: { 
      type: String, 
      unique: true 
    },
    phone: String,
    bio: String,
    designation: String,
    location: String,
    userHandle: String,
    password: String,
    verifyUser:{
      type:Boolean,
      default:false
    },
    verifyEmail:{
       type:Boolean,
       default:false
    },
    status:{
      type:String,
      enum:["active", "inactive"],
      default:"inactive"
    },
    hero_img: {
      type: String,
      default: "https://savageseller.s3.us-west-1.amazonaws.com/1710418064588-profile.png",
    },
    cover_img: {
      type: String,
      default: "https://community.savageseller.com/assets/communityBanner.png",
    },
    accountType: {
      type: String,
      enum: ["user", "admin", "superadmin", "master"],
      default: "user",
    },
  
    permissions: {
      admin: { type: Boolean, default: false },
      marketplace: { type: Boolean, default: false },
      community: { type: Boolean, default: false },
      userAccess: { type: Boolean, default: false },
    },
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
      linkedin: String,
    },

    communities: [{ type: Schema.Types.ObjectId, ref: 'Community' }],
    products:{
      type: Array,
      default: []
    },
    wishlists:{
      type: Array,
      default: []
    },
  
  },
  {
    timestamps: true,
  });

  const userModel = model('user',userSchema)

  export default userModel;