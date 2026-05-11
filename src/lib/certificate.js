import jsPDF from "jspdf";

export async function generateCertificatePDF(data) {
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  const W = 297, H = 210;
  const CenterX = W / 2;

  // 1. Background
  pdf.setFillColor(12, 12, 16);
  pdf.rect(0, 0, W, H, "F");

  // 2. Borders
  pdf.setDrawColor(201, 169, 110);
  pdf.setLineWidth(2.5);
  pdf.rect(9, 9, W - 18, H - 18, "S");
  pdf.setLineWidth(0.2);
  pdf.rect(14, 14, W - 28, H - 28, "S");

  // 3. Brand Header
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(201, 169, 110); // Gold
  pdf.text("PRISM", CenterX, 28, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 95); // Faint
  pdf.text("PLAGIARISM RESISTANT INTEGRITY SYSTEM FOR MEDIA", CenterX, 33, { align: "center" });

  // 4. Main Title Area
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(28); // Increased for proper main-header hierarchy
  pdf.setTextColor(232, 230, 225); // Off-white
  pdf.text("CERTIFICATE OF OWNERSHIP", CenterX, 58, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(154, 152, 145); // Muted
  pdf.text("This certifies that the following digital artwork has been registered on the Ethereum blockchain", CenterX, 66, { align: "center" });

  // 5. Artwork Title
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(20);
  pdf.setTextColor(201, 169, 110); // Gold
  pdf.text(`"${data.title}"`, CenterX, 86, { align: "center" });

  // 6. Two-Column Metadata (Perfectly Symmetrical)
  const leftColX = CenterX - 65;
  const rightColX = CenterX + 65;
  const labelY = 105;
  const valueY = 112;

  // -- Left Column: Owner
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(154, 152, 145);
  pdf.text("REGISTERED OWNER", leftColX, labelY, { align: "center" });
  
  pdf.setFont("helvetica", "bold"); // Matched weight to Date
  pdf.setFontSize(14);
  pdf.setTextColor(232, 230, 225);
  pdf.text(data.artistName || "Verified Digital Artist", leftColX, valueY, { align: "center" });

  pdf.setFont("courier", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 95);
  pdf.text(`Wallet: ${data.owner}`, leftColX, valueY + 5, { align: "center" });

  // -- Right Column: Date
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(154, 152, 145);
  pdf.text("REGISTRATION DATE", rightColX, labelY, { align: "center" });
  
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(14);
  pdf.setTextColor(232, 230, 225);
  const date = new Date(data.timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric"
  });
  pdf.text(date, rightColX, valueY, { align: "center" });

  // 7. Content Hash Box (Centered Data)
  const boxWidth = W - 80;
  const boxX = (W - boxWidth) / 2; // Centers the box dynamically
  
  pdf.setFillColor(17, 17, 22);
  pdf.roundedRect(boxX, 132, boxWidth, 22, 3, 3, "F");
  
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(100, 100, 95);
  pdf.text("SHA-256 CONTENT HASH", CenterX, 140, { align: "center" });
  
  pdf.setFont("courier", "bold");
  pdf.setFontSize(10); // Larger than label for hierarchy
  pdf.setTextColor(154, 152, 145);
  pdf.text(data.contentHash, CenterX, 148, { align: "center" });

  // 8. Identifiers
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.setTextColor(201, 169, 110);
  pdf.text(`CERTIFICATE ID: ${data.certId}`, CenterX, 172, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(100, 100, 95);
  pdf.text(`IPFS HASH: ${data.ipfsHash}`, CenterX, 178, { align: "center" });

  // 9. Footer
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(60, 60, 58);
  pdf.text(
    "This certificate is cryptographically secured. Verify at prism.vercel.app/verify",
    CenterX, H - 20, { align: "center" }
  );

  return pdf;
}