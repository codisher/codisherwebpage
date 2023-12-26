const userisLogin = async (req,res,next)=>
{
    try{
         if(req.session.admin_id){}
         else{
           return  res.redirect("/admin/adminlogin")
         }
         next();
    }
    catch(error)
    {
        console.log(error.message)
    }
}
const userisLogout = async (req,res,next)=>
{
    try{
         if(req.session.admin_id)
         {
            return res.redirect("/admin/adminpage")
         }
        next();
    }
    catch(error)
    {
        console.log(error.message)
    }
}
module.exports= {
    userisLogin,
    userisLogout
}