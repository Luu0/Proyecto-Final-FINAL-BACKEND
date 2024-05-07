import nodemailer from 'nodemailer'
import config from '../Config/config.js'

const transport = nodemailer.createTransport({
  service:'gmail',
  port: 465,
  auth:{
    user:"valentinolucero93@gmail.com",
    pass:"rqdwaamdpadpogso"

  },
  secure:true,
  tls:{
    rejectUnauthorized: false
  }
})

const sendMail = async (email, ticket) =>{
  console.log(email)
  let result = await transport.sendMail({
    from: 'Compras <valentinolucero93@gmail.com>',
    to: email,
    subject: "Su ticket",
    html: `<div> 
        <p>Código:${ticket.code}</p>
        <p>Monto:${ticket.amount}</p>
        <p>Fecha y Hora:${ticket.purchase_datetime}</p>
    </div>`
  })
}


export const sendPasswordToResetEmail = async (email,resetToken)=>{

  const resetUrl = `http://localhost:8080/users/reset-password/${resetToken}`;

  const mailOptions = {
    from: 'Compras <valentinolucero93@gmail.com>',
    to: email,
    subject: 'Recuperación de Contraseña',
    html: `
      <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
      <p>Si no solicitaste esto, puedes ignorar este correo electrónico.</p>
      <p>Si deseas restablecer tu contraseña, haz clic en el siguiente enlace:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>Este enlace expirará en 30 minutos.</p>
    `
  };

  try {
    await transport.sendMail(mailOptions);
    console.log('Correo electrónico de recuperación de contraseña enviado correctamente.');
  } catch (error) {
    console.error('Error al enviar el correo electrónico de recuperación de contraseña:', error);
  }
}

export default sendMail