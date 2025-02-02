const asyncHandler = (requestHandler)=>{
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res)).catch((err)=>next(err)) //  it is the other metthod of wrapping using promisess
    }
 }

export {asyncHandler}






// const asyncHandler =(fn)=>async(req,res,next)=>{// this method is know as higher order function where it takes the function as param and then execute that function
//     try{
//         await fn(req,res,next)
//     }catch(error){
//         res.status(error.code || 500).json({
//             success : false,
//             message : error.message // we pass the json format so that frontend developer can get the clear message through the flag
//         })
//     }
// }
