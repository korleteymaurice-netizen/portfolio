import { updateOrDelete } from '../_crud.js'; export default (req,res)=>updateOrDelete(req,res,'experience',req.query.id);
