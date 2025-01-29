import mongoose, {Schema} from 'mongoose'
import mongooseAggregatePaginate



from 'mongoose-aggregate-paginate-v2'
const videoSchema = new Schema(
    {
        videoFile : {
            type : String,//cloudinary url
            required : true,
        },
        thumbnail : {
            type : String,
            reuired : true
        },
        title : {
            type : String,
            required : true
        },
        description : {
            type : String,
            required : true
        },
        duration : {
            type : Number,
            required : true // 
        },
        views : {
            type : Number,
            default : true
        },
        isPublished :{
            type :Boolean,
            required : true
        },
        owner : {
            type : Schema.Types.ObjectId,
            ref : "Users"
        }


    },{
        timestamps:true
    }
)

videoSchema.plugin(mongooseAggregatePaginate)// its a mongo db plugin that allows you to add aggregation

export const video = mongoose.model("video",videoSchema)