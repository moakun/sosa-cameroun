"use client";

import { useSession } from "next-auth/react";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Certificate } from "@/components/Certificate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Loader2 } from "lucide-react";

export default function Attestation() {
  const { data: session } = useSession();
  const [isGenerating, setIsGenerating] = useState(false);
  const hiddenCertificateRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    if (!hiddenCertificateRef.current || !session?.user?.email) return;

    setIsGenerating(true);
    try {
      // Capture the hidden full-size certificate
      const canvas = await html2canvas(hiddenCertificateRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: "#ffffff",
        allowTaint: true,
        imageTimeout: 15000,
        windowWidth: 800,
        windowHeight: 600,
      });

      const imgData = canvas.toDataURL("image/png", 0.85);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const availableWidth = pdfWidth - 2 * margin;
      const availableHeight = pdfHeight - 2 * margin;

      const canvasRatio = canvas.width / canvas.height;
      const availableRatio = availableWidth / availableHeight;

      let imgWidth, imgHeight, x, y;

      if (canvasRatio > availableRatio) {
        imgWidth = availableWidth;
        imgHeight = availableWidth / canvasRatio;
        x = margin;
        y = margin + (availableHeight - imgHeight) / 2;
      } else {
        imgHeight = availableHeight;
        imgWidth = availableHeight * canvasRatio;
        x = margin + (availableWidth - imgWidth) / 2;
        y = margin;
      }

      pdf.addImage(imgData, "PNG", x, y, imgWidth, imgHeight, undefined, "FAST");
      pdf.save("certificat.pdf");

      const response = await fetch("/api/certinfo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email }),
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour dans la base de données");
      }
    } catch (error) {
      console.error("Erreur:", error);
      alert("Erreur lors de la génération du certificat");
    } finally {
      setIsGenerating(false);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Veuillez vous connecter pour voir votre certificat.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-8 px-4">
      <div className="max-w-screen-lg mx-auto space-y-4 sm:space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-bold">Certificat</h1>
          <Button onClick={downloadCertificate} disabled={isGenerating} className="w-full sm:w-auto">
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Génération...
              </>
            ) : (
              "Télécharger le certificat"
            )}
          </Button>
        </div>

        {/* Visible responsive certificate */}
        <div className="border rounded-lg overflow-hidden shadow-lg bg-white">
          <div className="w-full overflow-x-auto">
            <Certificate
              userName={session.user?.fullName || "Participant"}
              company={session.user?.companyName || "Entreprise"}
              date={new Date()}
              courseName="Formation Anti-corruption"
              responsive
            />
          </div>
        </div>

        {/* Hidden full-size certificate for PDF generation */}
        <div className="fixed -left-[9999px] -top-[9999px]" aria-hidden="true">
          <div ref={hiddenCertificateRef}>
            <Certificate
              userName={session.user?.fullName || "Participant"}
              company={session.user?.companyName || "Entreprise"}
              date={new Date()}
              courseName="Formation Anti-corruption"
              responsive={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}