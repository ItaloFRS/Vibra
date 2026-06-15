package com.vibra.tickets.service;

import com.google.zxing.*;
import com.google.zxing.client.j2se.BufferedImageLuminanceSource;
import com.google.zxing.common.HybridBinarizer;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.ImageType;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class QrExtractionService {

    public static class QrExtractionResult {
        public String content;
        public String base64Image;
        public int page;

        public QrExtractionResult(String content, String base64Image, int page) {
            this.content = content;
            this.base64Image = base64Image;
            this.page = page;
        }
    }

    public List<QrExtractionResult> extractQrCodes(MultipartFile file) throws IOException {
        List<QrExtractionResult> results = new ArrayList<>();
        String contentType = file.getContentType();

        if (contentType != null && contentType.equalsIgnoreCase("application/pdf")) {
            // Process PDF
            try (PDDocument document = Loader.loadPDF(file.getBytes())) {
                PDFRenderer pdfRenderer = new PDFRenderer(document);
                for (int page = 0; page < document.getNumberOfPages(); page++) {
                    // Use 300 DPI for better QR detection
                    BufferedImage image = pdfRenderer.renderImageWithDPI(page, 300, ImageType.RGB);
                    extractFromImage(image, page + 1, results);
                }
            }
        } else {
            // Process as generic Image
            BufferedImage image = ImageIO.read(new ByteArrayInputStream(file.getBytes()));
            if (image != null) {
                extractFromImage(image, 1, results);
            }
        }

        return results;
    }

    private void extractFromImage(BufferedImage image, int page, List<QrExtractionResult> results) {
        try {
            LuminanceSource source = new BufferedImageLuminanceSource(image);
            BinaryBitmap bitmap = new BinaryBitmap(new HybridBinarizer(source));
            Reader reader = new MultiFormatReader();
            
            // Try to decode
            Result result = reader.decode(bitmap);
            
            // If success, we have the result and points
            ResultPoint[] points = result.getResultPoints();
            if (points != null && points.length > 0) {
                BufferedImage croppedQr = cropQrCode(image, points);
                String base64Image = convertToBase64(croppedQr);
                results.add(new QrExtractionResult(result.getText(), base64Image, page));
            }
        } catch (NotFoundException | ChecksumException | FormatException e) {
            // QR Code not found in this image, ignore.
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private BufferedImage cropQrCode(BufferedImage original, ResultPoint[] points) {
        float minX = Float.MAX_VALUE;
        float minY = Float.MAX_VALUE;
        float maxX = 0;
        float maxY = 0;

        for (ResultPoint point : points) {
            if (point.getX() < minX) minX = point.getX();
            if (point.getY() < minY) minY = point.getY();
            if (point.getX() > maxX) maxX = point.getX();
            if (point.getY() > maxY) maxY = point.getY();
        }

        int padding = 40; // Add some margin around the QR code
        
        int x = Math.max(0, (int) minX - padding);
        int y = Math.max(0, (int) minY - padding);
        int width = Math.min(original.getWidth() - x, (int) (maxX - minX) + (padding * 2));
        int height = Math.min(original.getHeight() - y, (int) (maxY - minY) + (padding * 2));

        // Ensure we don't try to crop outside the image
        if (width <= 0 || height <= 0) {
            return original; // Fallback to original
        }

        return original.getSubimage(x, y, width, height);
    }

    public String convertToBase64(BufferedImage image) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(image, "png", baos);
        byte[] imageBytes = baos.toByteArray();
        return "data:image/png;base64," + Base64.getEncoder().encodeToString(imageBytes);
    }

    public String extractFullText(MultipartFile file) throws IOException {
        String contentType = file.getContentType();
        if (contentType != null && contentType.equalsIgnoreCase("application/pdf")) {
            try (PDDocument document = Loader.loadPDF(file.getBytes())) {
                PDFTextStripper stripper = new PDFTextStripper();
                return stripper.getText(document);
            }
        }
        return ""; // Para imagens, o texto seria o próprio QR ou requeriria OCR real local
    }
}
