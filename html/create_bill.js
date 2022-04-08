require('html-pdf');
var pdf = require('html-pdf');
var options = { format: 'Letter' };
function get_bill_html(billInfo, companyInfo){
    return `<body></body>`;
}
function create_bill(billInfo, companyInfo){
    const html = get_bill_html(billInfo, companyInfo);
    pdf.create(html, options).toFile('./bills/bill-'+(billInfo.id).toString()+'.pdf', function(err, res) {
        if (err) return console.log(err);
      });
}