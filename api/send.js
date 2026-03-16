
const key = req.headers["x-api-key"];

if(key !== "secret123"){
 return res.status(403).json({error:"Unauthorized"});
}
export default async function handler(req, res){

  if(req.method !== "POST"){
    return res.status(405).end("Only POST allowed");
  }

  const { type, text, image } = req.body;

  const TOKEN = process.env.BOT_TOKEN;
  const CHAT  = process.env.CHAT_ID;

  if(type === "text"){

    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        chat_id: CHAT,
        text: text
      })
    });

  }

  if(type === "photo"){

    const blob = await fetch(image).then(r=>r.blob());

    const form = new FormData();

    form.append("chat_id", CHAT);
    form.append("photo", blob, "pic.jpg");

    await fetch(`https://api.telegram.org/bot${TOKEN}/sendPhoto`,{
      method:"POST",
      body: form
    });

  }

  res.json({ success:true });

}
