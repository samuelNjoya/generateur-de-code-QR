let currentType = "website";

// Bootstrap Validation
(() => {
    'use strict';
    const forms = document.querySelectorAll('.needs-validation');
    Array.from(forms).forEach(form => {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
})();

// Elements
const websiteBtn = document.getElementById('websiteBtn');
const contactBtn = document.getElementById('contactBtn');
const websiteFields = document.getElementById('websiteFields');
const contactFields = document.getElementById('contactFields');
const qrForm = document.getElementById('qrForm');
const qrcodeDiv = document.getElementById('qrcode');
const contactPreviewDiv = document.getElementById('contactPreview');
const previewPanel = document.getElementById('previewPanel');
const qrColor = document.getElementById('qrColor');
const bgColor = document.getElementById('bgColor');
const qrColorHex = document.getElementById('qrColorHex');
const bgColorHex = document.getElementById('bgColorHex');
const qrSizeInput = document.getElementById('qrSize');
const labelInput = document.getElementById('qrLabel');
const qrBlock = document.getElementById('qr-block');
const labelDisplay = document.getElementById('labelDisplay');
const outputSection = document.getElementById('output');
const resetBtn = document.getElementById('resetAll');

// Helpers
function setType(type) {
    currentType = type;
    if (type === "website") {
        websiteFields.style.display = "block";
        contactFields.style.display = "none";
        contactPreviewDiv.style.display = "none";
        websiteBtn.classList.replace('btn-secondary', 'btn-primary');
        contactBtn.classList.replace('btn-primary', 'btn-secondary');
    } else {
        websiteFields.style.display = "none";
        contactFields.style.display = "block";
        contactPreviewDiv.style.display = "block";
        contactBtn.classList.replace('btn-secondary', 'btn-primary');
        websiteBtn.classList.replace('btn-primary', 'btn-secondary');
        updateContactPreview();
    }
    qrBlock.style.display = "none";
    qrForm.classList.remove('was-validated');
}

// Synchronisation couleurs/hex
function synchronizeColorInput(colorInput, hexInput) {
    colorInput.addEventListener('input', () => { hexInput.value = colorInput.value; });
    hexInput.addEventListener('input', () => {
        if (/^#([A-Fa-f0-9]{6})$/.test(hexInput.value)) colorInput.value = hexInput.value;
    });
}
synchronizeColorInput(qrColor, qrColorHex);
synchronizeColorInput(bgColor, bgColorHex);

// Génération vCard contact
function getVCard() {
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const phone = document.getElementById('contactPhone').value;
    const phone2 = document.getElementById('contactPhone2').value;
    const company = document.getElementById('contactCompany').value;
    let vcard = "BEGIN:VCARD\nVERSION:3.0\n";
    if (name) vcard += `FN:${name}\n`;
    if (company) vcard += `ORG:${company}\n`;
    if (email) vcard += `EMAIL:${email}\n`;
    if (phone) vcard += `TEL:${phone}\n`;
     if (phone2) vcard += `TEL:${phone2}\n`;
    vcard += "END:VCARD";
    return vcard;
}

// Contact live preview
function updateContactPreview() {
    const name = document.getElementById('contactName').value;
    const email = document.getElementById('contactEmail').value;
    const phone = document.getElementById('contactPhone').value;
     const phone2 = document.getElementById('contactPhone2').value;
    const company = document.getElementById('contactCompany').value;
    previewPanel.innerHTML = `
    <strong>Nom:</strong> ${name || '-'}<br>
    <strong>Email:</strong> ${email || '-'}<br>
    <strong>Téléphone:</strong> ${phone || '-'}<br>
    <strong>Téléphone 2:</strong> ${phone2 || '-'}<br>
    <strong>Profession:</strong> ${company || '-'}
  `;
}

// Génération QR code
function generateQR(data, color, bg, size, label) {
    qrcodeDiv.innerHTML = '';
    labelDisplay.textContent = label ? label : '';
    new QRCode(qrcodeDiv, {
        text: data,
        width: size,
        height: size,
        colorDark: color,
        colorLight: bg,
        correctLevel: QRCode.CorrectLevel.H
    });
    qrBlock.style.display = "block";
}

// Gestion dynamique QR
['contactName', 'contactEmail', 'contactPhone','contactPhone2', 'contactCompany'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
        updateContactPreview();
        if (currentType === "contact") {
            const vCard = getVCard();
            generateQR(vCard, qrColor.value, bgColor.value, parseInt(qrSizeInput.value), labelInput.value);
        }
    });
});
labelInput.addEventListener('input', () => {
    if (qrBlock.style.display !== "none") labelDisplay.textContent = labelInput.value;
});

[qrcodeDiv, qrColor, bgColor, qrColorHex, bgColorHex, qrSizeInput].forEach(el => {
    el.addEventListener('input', () => {
        let data;
        if (currentType === "website") {
            data = document.getElementById('websiteUrl').value;
            if (data) generateQR(data, qrColor.value, bgColor.value, parseInt(qrSizeInput.value), labelInput.value);
        } else {
            data = getVCard();
            generateQR(data, qrColor.value, bgColor.value, parseInt(qrSizeInput.value), labelInput.value);
        }
    });
});

// Submit
qrForm.onsubmit = function (e) {
    e.preventDefault();
    e.stopPropagation();
    let valid = qrForm.checkValidity();
    if (!valid) return false;
    let data;
    if (currentType === "website") {
        data = document.getElementById('websiteUrl').value;
        if (data) generateQR(data, qrColor.value, bgColor.value, parseInt(qrSizeInput.value), labelInput.value);
    } else {
        data = getVCard();
        generateQR(data, qrColor.value, bgColor.value, parseInt(qrSizeInput.value), labelInput.value);
    }
    qrForm.classList.add('was-validated');
    return false;
};
// Switch type
websiteBtn.onclick = () => setType('website');
contactBtn.onclick = () => setType('contact');

// Réinitialiser
resetBtn.onclick = () => {
    qrForm.reset();
    qrColor.value = "#222831";
    qrColorHex.value = "#222831";
    bgColor.value = "#ffffff";
    bgColorHex.value = "#ffffff";
    qrSizeInput.value = 220;
    labelInput.value = "";
    qrBlock.style.display = "none";
    contactPreviewDiv.style.display = "none";
    qrForm.classList.remove('was-validated');
    setType("website");
    previewPanel.innerHTML = "";
};
// Export PNG
document.getElementById('downloadImg').onclick = () => {
    const qrImg = qrcodeDiv.querySelector('img') || qrcodeDiv.querySelector('canvas');
    if (!qrImg) return;
    let canvas;
    if (qrImg.tagName === 'IMG') {
        canvas = document.createElement('canvas');
        const size = parseInt(qrSizeInput.value);
        canvas.width = size;
        canvas.height = size + (labelInput.value ? 36 : 0);
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = bgColor.value;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(qrImg, 0, 0, size, size);
        if (labelInput.value) {
            ctx.fillStyle = qrColor.value;
            ctx.font = "18px Arial";
            ctx.textAlign = "center";
            ctx.fillText(labelInput.value, size / 2, size + 26);
        }
        canvas.toBlob(blob => saveAs(blob, "qrcode-labellise.png"));
    } else {
        // canvas
        const size = parseInt(qrSizeInput.value);
        let c2 = document.createElement('canvas');
        c2.width = size;
        c2.height = size + (labelInput.value ? 36 : 0);
        const ctx = c2.getContext('2d');
        ctx.fillStyle = bgColor.value;
        ctx.fillRect(0, 0, c2.width, c2.height);
        ctx.drawImage(qrImg, 0, 0, size, size);
        if (labelInput.value) {
            ctx.fillStyle = qrColor.value;
            ctx.font = "18px Arial";
            ctx.textAlign = "center";
            ctx.fillText(labelInput.value, size / 2, size + 26);
        }
        c2.toBlob(blob => saveAs(blob, "qrcode-labellise.png"));
    }
};
// Export PDF
document.getElementById('downloadPdf').onclick = () => {
    const qrImg = qrcodeDiv.querySelector('img') || qrcodeDiv.querySelector('canvas');
    if (!qrImg) return;
    let imgData;
    const size = parseInt(qrSizeInput.value);
    let pdf = new window.jspdf.jsPDF({ orientation: "portrait", unit: "px", format: [size + 60, size + 100] });
    if (qrImg.tagName === 'IMG') {
        imgData = qrImg.src;
        pdf.setFillColor(bgColor.value);
        pdf.rect(0, 0, size + 60, size + 100, 'F');
        pdf.addImage(imgData, "PNG", 30, 20, size, size);
    } else {
        imgData = qrImg.toDataURL();
        pdf.setFillColor(bgColor.value);
        pdf.rect(0, 0, size + 60, size + 100, 'F');
        pdf.addImage(imgData, "PNG", 30, 20, size, size);
    }
    // Label optionnel et stylé, centré
    if (labelInput.value) {
        pdf.setTextColor(qrColor.value);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(18);
        pdf.text(labelInput.value, size / 2 + 30, size + 50, { align: 'center' });
    }
    pdf.save('qrcode-labellise.pdf');
};
// Initialisation
setType('website');
