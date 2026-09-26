import { updateOrDelete } from '../_crud.js'; export default (req,res)=>updateOrDelete(req,res,'education',req.query.id);
