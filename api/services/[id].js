import { updateOrDelete } from '../_crud.js'; export default (req,res)=>updateOrDelete(req,res,'services',req.query.id);
