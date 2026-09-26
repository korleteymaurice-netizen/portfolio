export const ok=(res,data)=>res.status(200).json(data);
export const created=(res,data)=>res.status(201).json(data);
export const bad=(res,message='Invalid request')=>res.status(400).json({error:message});
export const method=(res,allowed)=>{res.setHeader('Allow',allowed.join(', '));return res.status(405).json({error:'Method not allowed'});};
