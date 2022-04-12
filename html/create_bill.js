require("html-pdf");
var pdf = require("html-pdf");

var options = {
    format: "Letter",
    base: "file:///home/timon/code/rechnung/resources/",
    width: "594px",
    height: "840px",
};
function get_bill_html(billInfo, companyInfo) {
    return `<!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Rechnung</title>
        </head>
        <body>
            <div class="right">
            
            <img src="data:image/png;base64, ${
                companyInfo.logo
            }" alt="" id="logo" />
            </div>
            <div class="customer">
                ${
                    billInfo.customerName != undefined
                        ? `
                <div class="name">${billInfo.customerName}</div>
                <div class="street">${billInfo.customerStreet}</div>
                <div class="city">${billInfo.customerCity}</div>
                `
                        : ""
                }
            </div>
            <div class="right">
                <div class="company">
                    <div class="name">${companyInfo.name}</div>
                    <div class="street">${companyInfo.street}</div>
                    <div class="city">${companyInfo.city}</div>
                    <div class="tel">Tel.: ${companyInfo.tel}</div>
                    <div class="mail">Mail: ${companyInfo.mail}</div>
                </div>
            </div>
            <div class="billInfo">
                <div class="date">Datum: ${billInfo.date}</div>
                <div class="number">Rechnungsnummer: ${billInfo.id}</div>
            </div>
            <p class="preamble">
                Sehr geehrter Kunde, <br /><br />
                vielen Dank für ihren Auftrag. Hiermit berechnen wir Ihnen folgende
                Leistungen.
            </p>
            <div class="table">
                <table>
                    <tr>
                        <th>Bezeichnung</th>
                        <th>Anzahl</th>
                        <th>Einzelpreis</th>
                    </tr>
                    ${billInfo.products
                        .map(
                            (product) => `
                    <tr>
                        <td>${product.name}</td>
                        <td>${product.quantity}</td>
                        <td>${product.price.toString().replace(".", ",")}€</td>
                    </tr>
                        `
                        )
                        .join("")}
                        <tr>
                        <td></td>
                        <td></td>
                        <td>
                            <h1 class="sum">
                                Betrag: ${billInfo.products
                                    .reduce(
                                        (sum, product) =>
                                            sum +
                                            product.price * product.quantity,
                                        0
                                    )
                                    .toString()
                                    .replace(".", ",")} €
                            </h1>
                        </td>
                    </tr>
                </table>
    
                ${
                    companyInfo.kleinunternehmer == true
                        ? `
                <p>
                    Im Sinne der Kleinunternehmerregelung nach § 19 UStG enthält der
                    ausgewiesene Betrag keine Umsatzsteuer.
                </p>
                `
                        : ``
                }
            </div>
            <p class="closingamble">
                ${
                    billInfo.cash == false
                        ? `
                Bitte überweisen Sie den oben genannten Betrag innerhalb von
                ${billInfo.paymentLimit} Tagen, mit dem Verwendungszweck: "Rn:
                ${billInfo.id}", an das unten aufgeführte Konto.
                <br /><br />Vielen
                Dank! `
                        : "Bitte bezahlen Sie diese Rechnung Bar bei mir. <br> <br>Vielen Dank! "
                }
            </p>
            ${
                billInfo.cash == true
                    ? `
                    <div class="right flex-col">
                    <p>Mit folgender Unterschrift, bestätige ich, ___________, dass die Zahlung in Bar getätigt wurde. </p><div class="signatureField"></div>
                    </div>`
                    : ""
            }
            <div class="footer">
            <div class="company">
                <div class="name">${companyInfo.name}</div>
                <div class="street">${companyInfo.street}</div>
                <div class="city">${companyInfo.city}</div>
                <div class="tax">St. -Nr.: ${companyInfo.tax}</div>
                <div class="tel">Tel: ${companyInfo.tel}</div>
                <div class="mail">Mail: ${companyInfo.mail}</div>
                <div class="website">${companyInfo.website}</div>
            </div>
            <div class="bank">
                <div class="name">Kreditinstitut: ${companyInfo.bank}</div>
                <div class="iban">IBAN: ${companyInfo.iban}</div>
                <div class="bic">BIC: ${companyInfo.bic}</div>
                <div class="account">Kontoinhaber: ${companyInfo.Kontoinhaber}
                </div>
        </div>
        </div>
    
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    font-size:  6.5vw;
                    font-family: Arial, Helvetica, sans-serif;
                    min-height:65em!important;
                    margin: 10% 10%;
                }

                .right {
                    width: 100%;
                    display: -webkit-flex;
                    -webkit-justify-content: flex-end;
                }
                #logo {
                    width: 20%;
                }
                .sum {
                    font-size: 1.3em;
                }
                .table {
                    text-align: left;
                    width: 100%;
                }
                table {
                    width: 100%;
                    table-layout: fixed;
                }
                .signatureField{
                    border: 1px solid black;
                    height: 3em;
                    width: 40%;
                font-size: 2em;
                }
                .flex-col{
                    display: -webkit-flex;
                    -webkit-flex-direction: column;
                    -webkit-align-items: flex-end;
                }
                .flex-col p{
                    width: 50%;
                    text-align: right;
                }
                .right .company{
                    margin-top: 2em;
                }
                .customer{
                    margin-top: 3em;
                }
                .billInfo{
                    margin-top: 4em;
                }
                .preamble{
                    margin-top: 4em;
                }
.footer{
    position: absolute;
    bottom: 0;
    width: 80%;
    display: -webkit-flex;
    -webkit-justify-content: space-between;
}
            </style>
        </body>
    </html>
    `;
}
function create_bill(billInfo, companyInfo) {
    const html = get_bill_html(billInfo, companyInfo);
    pdf.create(html, options).toFile(
        "./bills/bill-" + billInfo.id.toString() + ".pdf",
        function (err, res) {
            if (err) {
                console.log(err);
            } else {
                document.querySelector(".confirmation").innerHTML =
                    "Rechnung " + billInfo.id + " erstellt";
            }
        }
    );
}
