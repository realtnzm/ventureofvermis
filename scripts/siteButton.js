function copyButton(buttonURL) {
  let buttonCode = `<a href="https://nev.nya.je" target="_blank"><img src="${buttonURL}" alt="nev.nya.je button" title="Nev.nya.je :^)"></a>`;

  try {
    navigator.clipboard.writeText(buttonCode);
    alert(
      "Code copied! Let me know when you've linked me so I can link you back, if you want :^)",
    );
  } catch (err) {
    alert("Failed to copy. Please try again!");
  }
}
