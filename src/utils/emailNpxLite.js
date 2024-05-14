export default function emailCopy(buttonLinks){
return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Feedback</title>
</head>
<body style="font-family: sans-serif;">
  <p style="text-align: center; font-weight: 500; padding: 10px;">How was your experience using our product? Please rate your experience below.</p>
  
  <div style="text-align: center; margin-top: 20px;">
    <a href=${buttonLinks[0]} style="background-color: #ff4a4a; border-radius: 4px; padding: 10px 20px; color: #fff; text-decoration: none; margin-right: 10px;">Bad 😞</a>
    <a href=${buttonLinks[1]} style="background-color: #f3dd1f; border-radius: 4px; padding: 10px 20px; color: #000; text-decoration: none; margin-right: 10px;">Average 😐</a>
    <a href=${buttonLinks[2]} style="background-color: #129561; border-radius: 4px; padding: 10px 20px; color: #fff; text-decoration: none;">Excellent 😄</a>
  </div>
</body>
</html>
`
}