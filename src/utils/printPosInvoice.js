export const printPosInvoice = ({ orderDetails, id, formatDate }) => {
  if (!orderDetails) return;

  const items = orderDetails?.cart?.items || [];
  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const discount = Number(item.discountPercent) || 0;
    const qty = Number(item.quantity) || 1;
    const final = price - (price * discount) / 100;
    return sum + final * qty;
  }, 0);

  const vat = Number(orderDetails?.vat) || 0;
  const delivery = Number(orderDetails?.deliveryCharge) || 0;
  const total = subtotal + vat + delivery;

  const invoiceNo = orderDetails.invoiceNumber || id;
  const fullAddress = (orderDetails.address || "")
    .split(",")
    .map((a) => a.trim())
    .join(", ");

  const qrValue = "https://www.globalservicezone.com/e-commerce";

  const html = `
<html>
<head>
<title>GSZ MART - POS Invoice</title>

<script src="https://cdn.jsdelivr.net/npm/qrcode/build/qrcode.min.js"></script>

<style>
@page{size:85mm auto;margin:0;}
body{
  width:85mm;
  margin:0;
  font-family:"Courier New", monospace;
  font-size:11px;
  color:#000;
}
.center{text-align:center;}
.divider{border-top:1px dashed black;margin:6px 0;}
.address{font-size:10px;}
table{width:100%;border-collapse:collapse;}
th,td{font-size:10px;padding:2px;}
th{border-bottom:1px solid black;}
.qty{text-align:center;}
.total{text-align:right;}
.summary p{display:flex;justify-content:space-between;margin:2px 0;}
.grand{font-weight:bold;font-size:14px;border-top:1px dashed black;padding-top:3px;}
.footer{text-align:center;font-size:10px;}
</style>
</head>

<body>
<div class="center">
<h1>GSZ MART</h1>

<div class="address">
1224 E Baltimore Ave, Fort Worth, TX 76104 <br>
📞 +1 409-419-3426
</div>

<div class="address">
331/11 Flat-6C TV Link Rd, Rampura, Dhaka-1219 <br>
📞 +8801729631431
</div>

<div class="address">
🌐 www.globalservicezone.com
</div>
</div>

<div class="divider"></div>

<div>
<b>Invoice:</b> ${invoiceNo}<br/>
<b>Date:</b> ${formatDate(orderDetails.createdAt)}
</div>

<div class="divider"></div>

<div>
<b>Name:</b> ${orderDetails.name || "N/A"}<br>
<b>Phone:</b> ${orderDetails.phoneNumber || "N/A"}<br>
<b>Address:</b> ${fullAddress || "N/A"}<br>
<b>Payment:</b> ${
    orderDetails.paymentMethod === "cod"
      ? "Cash on Delivery"
      : orderDetails.paymentMethod || "N/A"
  }<br>
<b>Status:</b> ${orderDetails.paymentDone ? "PAID" : "UNPAID"}
</div>

<div class="divider"></div>

<table>
<thead>
<tr>
<th>Item</th>
<th class="qty">Qty</th>
<th class="qty">Size</th>
<th class="total">Total</th>
</tr>
</thead>
<tbody>
${items
  .map((item) => {
    const price = Number(item.price) || 0;
    const discount = Number(item.discountPercent) || 0;
    const qty = Number(item.quantity) || 1;
    const final = price - (price * discount) / 100;
    return `
<tr>
<td>${item.eProduct?.name || "N/A"}</td>
<td class="qty">${qty}</td>
<td class="qty">${item.size || "N/A"}</td>
<td class="total">${(final * qty).toFixed(2)}</td>
</tr>
    `;
  })
  .join("")}
</tbody>
</table>

<div class="divider"></div>

<div class="summary">
<p><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></p>
<p><span>VAT</span><span>${vat.toFixed(2)}</span></p>
<p><span>Delivery</span><span>${delivery.toFixed(2)}</span></p>
<p class="grand"><span>TOTAL</span><span>${total.toFixed(2)}</span></p>
</div>

<div class="divider"></div>

<div class="center">
<canvas id="qrcode"></canvas>
</div>

<div class="footer">
Thank you for shopping with GSZ MART ❤️
</div>

<script>
QRCode.toCanvas(document.getElementById("qrcode"),"${qrValue}",{width:75});
</script>

</body>
</html>
`;

  const printFrame = window.open("", "", "width=380,height=900");
  if (!printFrame) return;

  printFrame.document.open();
  printFrame.document.write(html);
  printFrame.document.close();

  printFrame.onload = () => {
    printFrame.focus();
    printFrame.print();
    setTimeout(() => printFrame.close(), 800);
  };
};
