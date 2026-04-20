"use client";
import Link from "next/link";
import Image from "next/image";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useProfile } from "@/lib/profile-context";
import { useRouter } from "next/navigation";
import MobileNav from "@/components/MobileNav";
import { gradeEssayAction } from "@/actions/grade-essay";
import { BOOKS } from "@/lib/books-data";
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// --- Constants ---

// --- Content Collections (Variations) ---

const LEVEL_VARIATIONS: Record<string, any[]> = {
  "A": [
    { id: "A", title: "Pembaca Dini", subtitle: "Level A", text: "Ini Kika. Ini Kura. Kika dan Kura bermain di depan rumah. Kika sayang Kura.", time: 30, image: "/images/stories/fluency_A.png" },
    { id: "A", title: "Pembaca Dini", subtitle: "Level A", text: "Kucing kecil main bola merah. Kucing lompat-lompat. Kucing senang sekali.", time: 30, image: "/images/stories/fluency_A_v2.png" }
  ],
  "B": [
    { id: "B", title: "Pembaca Awal", subtitle: "Level B", text: "Ibu pergi ke pasar tradisional. Ibu membeli sayur dan buah segar. Ani membantu Ibu membawa tas belanja yang berat.", time: 45, image: "/images/stories/fluency_B.png" },
    { id: "B", title: "Pembaca Awal", subtitle: "Level B", text: "Sari suka menyiram bunga matahari di kebun. Bunga matahari tumbuh tinggi dan besar. Sari bangga pada kebunnya.", time: 45, image: "/images/stories/fluency_B_v2.png" }
  ],
  "C": [
    { id: "C", title: "Pembaca Semenjana", subtitle: "Level C", text: "Kosi si kepik merasa cemas karena tidak bisa melihat dengan jelas. Dia takut akan tersesat di tengah hutan. Untunglah teman-temannya mengajak Kosi terbang bersama agar tetap aman.", time: 60, image: "/images/stories/fluency_C.png" },
    { id: "C", title: "Pembaca Semenjana", subtitle: "Level C", text: "Kelinci dan Tupai sedang piknik di bawah pohon ek besar. Mereka membawa buah-buahan dan kacang. Tiba-tiba, burung kecil datang menyapa mereka dengan riang.", time: 60, image: "/images/stories/fluency_C_v2.png" }
  ],
  "D": [
    { id: "D", title: "Pembaca Madya", subtitle: "Level D", text: "Ketika matahari mulai terbenam di ufuk barat, para nelayan segera merapatkan perahu mereka ke dermaga untuk menjual hasil tangkapan hari ini, sementara penduduk desa mulai menyalakan lampu di depan rumah masing-masing.", time: 90, image: "/images/stories/fluency_D.png" },
    { id: "D", title: "Pembaca Madya", subtitle: "Level D", text: "Danau gunung itu terlihat sangat jernih dan tenang di pagi hari. Ada perahu kecil bertenaga surya yang meluncur perlahan tanpa kebisingan, menjaga ekosistem tetap terjaga dengan baik.", time: 90, image: "/images/stories/fluency_D_v2.png" }
  ],
  "E": [
    { id: "E", title: "Pembaca Mahir", subtitle: "Level E", text: "Ekosistem hutan bakau memfasilitasi perlindungan kawasan pesisir dari ancaman erosi melalui struktur perakaran yang kompleks, sekaligus menjadi habitat esensial bagi berbagai biota laut yang saling bersimbiosis dalam menjaga keseimbangan alam.", time: 120, image: "/images/stories/fluency_E.png" },
    { id: "E", title: "Pembaca Mahir", subtitle: "Level E", text: "Laboratorium bawah laut masa depan ini dirancang khusus untuk memantau kesehatan terumbu karang. Para ilmuwan mengamati berbagai spesies ikan warna-warni yang berinteraksi dalam ekosistem laut yang sangat kompleks dan menakjubkan.", time: 120, image: "/images/stories/fluency_E_v2.png" }
  ]
};

const STORY_VARIATIONS: Record<string, any[]> = {
  "B-1": [
    {
      id: "B-1", title: "Kika dan Kura", theme: "Level B-1 — Pembaca Awal", icon: "home", color: "#34D399", colorDark: "#059669", image: "/images/stories/comp_A.png",
      text: "Ini Kika. Ini Kura. Kika dan Kura bermain di depan rumah. Kika sayang Kura.",
      questions: [
        { type: "mc", question: "Siapa nama teman Kika?", options: ["Kura", "Kuki", "Kaka", "Kiri"], correctAnswers: [0], barrettLevel: "literal" },
        { type: "cmc", question: "Tandai SEMUA tokoh yang ada di cerita ini!", options: ["Kika", "Kuki", "Kura", "Ibu"], correctAnswers: [0, 2], barrettLevel: "literal" },
        { type: "mc", question: "Di manakah Kika dan Kura bermain?", options: ["Di dalam rumah", "Di depan rumah", "Di sekolah", "Di taman"], correctAnswers: [1], barrettLevel: "reorganization" },
        { type: "essay", question: "Bagaimana perasaan Kika kepada Kura?", referenceAnswer: "Kika sangat sayang pada Kura.", barrettLevel: "inferential" },
        { type: "essay", question: "Bermain bersama teman adalah perbuatan yang baik. Berikan pendapatmu mengapa kita harus sayang pada teman!", referenceAnswer: "Kita harus sayang teman agar hidup rukun dan bermain bersama jadi menyenangkan.", barrettLevel: "evaluative" }
      ]
    },
    {
      id: "B-1", title: "Berbagi Makanan", theme: "Level B-1 — Pembaca Awal", icon: "restaurant", color: "#34D399", colorDark: "#059669", image: "/images/stories/comp_B1_v2.png",
      text: "Dua burung kecil berbagi makanan di sarang. Mereka saling membantu agar tetap kenyang dan bisa terbang jauh. Berbagi makanan itu indah dan membuat hati senang.",
      questions: [
        { type: "mc", question: "Apa yang dilakukan dua burung kecil itu?", options: ["Berbagi makanan", "Berkelahi", "Seling sembunyi", "Tidur nyenyak"], correctAnswers: [0], barrettLevel: "literal" },
        { type: "cmc", question: "Apa efek positif dari berbagi menurut cerita?", options: ["Tetap kenyang", "Hati senang", "Bisa terbang jauh", "Jadi lapar"], correctAnswers: [0, 1, 2], barrettLevel: "literal" },
        { type: "mc", question: "Manakah urutan peristiwa yang benar?", options: ["Burung lapar - Berbagi - Hati senang", "Hati senang - Berbagi - Lapar", "Terbang - Berbagi - Sarang rusak"], correctAnswers: [0], barrettLevel: "reorganization" },
        { type: "essay", question: "Mengapa burung-burung itu saling membantu?", referenceAnswer: "Agar mereka tetap kenyang dan bisa terbang jauh.", barrettLevel: "inferential" },
        { type: "essay", question: "Apakah tindakan burung itu patut ditiru? Jelaskan alasanmu!", referenceAnswer: "Ya, karena berbagi adalah tindakan terpuji yang membuat semua orang senang.", barrettLevel: "evaluative" }
      ]
    }
  ],
  "B-2": [
    {
      id: "B-2", title: "Membantu Ibu", theme: "Level B-2 — Pembaca Awal", icon: "shopping_basket", color: "#87CEEB", colorDark: "#5AAFD1", image: "/images/stories/fluency_B.png",
      text: "Pagi ini Ibu mengajak Ani ke pasar tradisional. Di sana banyak orang menjual sayur, buah, dan ikan segar. Ibu membeli bayam dan jeruk. \"Ani, tolong pegang tas belanjanya ya,\" kata Ibu dengan lembut.",
      questions: [
        { type: "mc", question: "Di mana latar tempat cerita ini?", options: ["Supermarket", "Taman kota", "Pasar tradisional", "Kebun"], correctAnswers: [2], barrettLevel: "literal" },
        { type: "cmc", question: "Pilih SEMUA barang atau makanan yang dibeli Ibu di pasar menurut teks!", options: ["Apel", "Jeruk", "Bayam", "Ikan"], correctAnswers: [1, 2], barrettLevel: "literal" },
        { type: "mc", question: "Apa saja isi pasar yang disebutkan dalam teks?", options: ["Baju dan sepatu", "Sayur, buah, dan ikan", "Buku dan pensil"], correctAnswers: [1], barrettLevel: "reorganization" },
        { type: "essay", question: "Mengapa Ibu meminta tolong Ani memegang tas?", referenceAnswer: "Karena tas belanjanya berat atau agar Ani membantu ibu.", barrettLevel: "inferential" },
        { type: "essay", question: "Apakah tindakan Ani membantu Ibu sudah tepat? Jelaskan alasanmu!", referenceAnswer: "Ya, karena membantu orang tua adalah kewajiban anak yang baik.", barrettLevel: "evaluative" }
      ]
    },
    {
      id: "B-2", title: "Membantu Nenek", theme: "Level B-2 — Pembaca Awal", icon: "volunteer_activism", color: "#87CEEB", colorDark: "#5AAFD1", image: "/images/stories/comp_B2_v2.png",
      text: "Lani melihat nenek membawa tas belanja yang sangat berat. Lani segera menghampiri nenek dan membantunya menyeberang jalan yang ramai dengan mobil. Nenek tersenyum lebar dan sangat berterima kasih kepada Lani.",
      questions: [
        { type: "mc", question: "Siapa yang Lani bantu di jalan?", options: ["Ibu Guru", "Nenek", "Adik kecil", "Teman bermain"], correctAnswers: [1], barrettLevel: "literal" },
        { type: "cmc", question: "Apa saja tindakan baik yang Lani lakukan?", options: ["Membawa tas berat", "Menyeberangkan nenek", "Memberi uang", "Marah-marah"], correctAnswers: [0, 1], barrettLevel: "literal" },
        { type: "mc", question: "Ringkasan cerita di atas adalah Lani membantu nenek yang sedang...", options: ["Marah", "Kesusahan membawa tas", "Tertidur"], correctAnswers: [1], barrettLevel: "reorganization" },
        { type: "essay", question: "Bagaimana perasaan nenek setelah dibantu Lani?", referenceAnswer: "Nenek merasa senang dan berterima kasih.", barrettLevel: "inferential" },
        { type: "essay", question: "Menurutmu, apa yang terjadi jika Lani tidak membantu nenek menyeberang?", referenceAnswer: "Nenek mungkin akan kesulitan menyeberang di jalan yang ramai.", barrettLevel: "evaluative" }
      ]
    }
  ],
  "B-3": [
    {
      id: "B-3", title: "Memancing di Desa", theme: "Level B-3 — Pembaca Awal", icon: "sailing", color: "#60A5FA", colorDark: "#2563EB", image: "/images/stories/comp_A.png",
      text: "Saat liburan sekolah tiba, Bima dan keluarganya pergi ke desa nenek. Udara di desa sangat sejuk dan segar karena banyak pepohonan. Bima sangat senang diajak memancing ikan di sungai kecil di belakang rumah nenek. Menurut ayah, memancing ikan bisa melatih kesabaran kita karena ikan tidak selalu langsung datang melahap umpan.",
      questions: [
        { type: "mc", question: "Ke mana Bima pergi saat liburan?", options: ["Ke desa nenek", "Ke pantai", "Ke gunung", "Ke kebun binatang"], correctAnswers: [0], barrettLevel: "literal" },
        { type: "cmc", question: "Apa saja aktivitas atau kondisi yang Bima sukai di desa?", options: ["Melihat banyak gedung", "Udara sangat sejuk", "Bisa memancing di sungai", "Udara jalanan berdebu"], correctAnswers: [1, 2], barrettLevel: "literal" },
        { type: "mc", question: "Klasifikasikan benda-benda yang terkait dengan memancing di teks!", options: ["Umpan dan Ikan", "Mobil dan Jalan", "Buku dan Tas"], correctAnswers: [0], barrettLevel: "reorganization" },
        { type: "essay", question: "Mengapa ayah berkata memancing bisa melatih kesabaran?", referenceAnswer: "Karena ikan tidak langsung datang melahap umpan.", barrettLevel: "inferential" },
        { type: "essay", question: "Apakah kamu setuju bahwa memancing adalah hobi yang baik? Berikan alasanmu!", referenceAnswer: "Setuju, karena bisa melatih ketenangan dan kesabaran.", barrettLevel: "evaluative" }
      ]
    },
    {
      id: "B-3", title: "Menanam Pohon", theme: "Level B-3 — Pembaca Awal", icon: "park", color: "#60A5FA", colorDark: "#2563EB", image: "/images/stories/comp_B3_v2.png",
      text: "Anak-anak kelas dua menanam pohon mahoni di halaman sekolah. Mereka bekerja sama menggali tanah yang gembur dan menyiram air secukupnya. Kata Pak Guru, pohon itu akan membuat udara sekolah jadi segar dan sangat teduh di masa depan.",
      questions: [
        { type: "mc", question: "Pohon apa yang ditanam anak-anak?", options: ["Mangga", "Mahoni", "Kelapa", "Pisang"], correctAnswers: [1], barrettLevel: "literal" },
        { type: "cmc", question: "Apa manfaat pohon di sekolah menurut Pak Guru?", options: ["Udara jadi segar", "Menjadi teduh", "Banyak sampah", "Menghasilkan buah koin"], correctAnswers: [0, 1], barrettLevel: "literal" },
        { type: "mc", question: "Susunan cara menanam pohon sesuai teks adalah...", options: ["Gali tanah - Siram air", "Siram air - Gali tanah", "Beli bibit - Tebang pohon"], correctAnswers: [0], barrettLevel: "reorganization" },
        { type: "essay", question: "Mengapa pohon bisa membuat udara jadi segar?", referenceAnswer: "Karena pohon menghasilkan oksigen dan menyerap kotoran di udara.", barrettLevel: "inferential" },
        { type: "essay", question: "Apakah menanam pohon adalah hal yang penting bagi lingkungan sekolah? Jelaskan!", referenceAnswer: "Sangat penting agar sekolah asri, sejuk, dan sehat.", barrettLevel: "evaluative" }
      ]
    }
  ],
  "C": [
    {
      id: "C", title: "Kosi si Kepik", theme: "Level C — Semenjana", icon: "landscape", color: "#FFB347", colorDark: "#E69A2E", image: "/images/stories/comp_C.png",
      text: "Kosi si kepik merasa cemas karena tidak bisa melihat dengan jelas. Dia takut akan tersesat di tengah hutan. Untunglah teman-temannya mengajak Kosi terbang bersama agar tetap aman. Mereka mengingatkan Kosi agar jangan tertidur karena Kosi memang gampang mengantuk.",
      questions: [
        { type: "mc", question: "Mengapa Kosi merasa cemas?", options: ["Karena lapar", "Karena kelelahan", "Karena tidak bisa melihat jelas", "Karena cuaca dingin"], correctAnswers: [2], barrettLevel: "literal" },
        { type: "cmc", question: "Apa yang ditakutkan oleh Kosi dan apa satu sifat uniknya?", options: ["Takut gelap", "Takut tersesat", "Gampang mengantuk", "Sayap patah"], correctAnswers: [1, 2], barrettLevel: "literal" },
        { type: "mc", question: "Kelompokkan fakta tentang Kosi berdasarkan teks!", options: ["Cemas, takut tersesat, mengantuk", "Berani, terbang sendiri, lapar", "Suka makan, tidur di pohon"], correctAnswers: [0], barrettLevel: "reorganization" },
        { type: "essay", question: "Mengapa teman-teman Kosi mengingatkannya agar jangan tertidur?", referenceAnswer: "Karena Kosi gampang mengantuk dan agar tetap aman saat terbang bersama.", barrettLevel: "inferential" },
        { type: "essay", question: "Menurutmu, apakah tindakan teman-teman Kosi sudah mencerminkan persahabatan yang baik? Jelaskan!", referenceAnswer: "Ya, karena mereka peduli dan membantu Kosi yang mengalami kesulitan.", barrettLevel: "evaluative" }
      ]
    },
    {
      id: "C", title: "Rubah dan Anggur", theme: "Level C — Semenjana", icon: "eco", color: "#FFB347", colorDark: "#E69A2E", image: "/images/stories/comp_C_v2.png",
      text: "Rubah yang cerdik mencoba mengambil buah anggur matang di sebuah pohon yang sangat tinggi. Dia mencoba melompat berkali-kali namun tetap gagal meraihnya. Akhirnya rubah itu menyerah dan berjalan pergi sambil berkata bahwa anggur itu pasti masam rasanya.",
      questions: [
        { type: "mc", question: "Apa buah yang ingin diambil rubah?", options: ["Apel", "Jeruk", "Anggur", "Pisang"], correctAnswers: [2], barrettLevel: "literal" },
        { type: "cmc", question: "Bagaimana usaha rubah dan apa alasannya menyerah?", options: ["Melompat berkali-kali", "Pohon terlalu tinggi", "Anggur dimakan burung", "Gagal meraihnya"], correctAnswers: [0, 1, 3], barrettLevel: "literal" },
        { type: "mc", question: "Urutan kejadian dalam cerita ini adalah...", options: ["Melihat anggur - Melompat - Menyerah", "Menyerah - Melompat - Makan", "Tidur - Bangun - Melompat"], correctAnswers: [0], barrettLevel: "reorganization" },
        { type: "essay", question: "Mengapa akhirnya rubah berkata bahwa anggur itu pasti masam?", referenceAnswer: "Untuk menghibur diri sendiri karena dia gagal meraihnya.", barrettLevel: "inferential" },
        { type: "essay", question: "Apa pendapatmu tentang sikap rubah yang meremehkan anggur saat dia tidak sanggup mengambilnya?", referenceAnswer: "Itu adalah sikap yang kurang baik (menghibur diri dengan merendahkan yang lain).", barrettLevel: "evaluative" }
      ]
    }
  ],
  "D": [
    {
      id: "D", title: "Energi Bersih", theme: "Level D — Madya", icon: "bolt", color: "#A78BFA", colorDark: "#7C3AED", image: "/images/stories/fluency_D.png",
      text: "Ketika teknologi berkembang pesat, kebutuhan akan energi bersih semakin mendesak untuk mengurangi dampak pemanasan global. Panel surya dan kincir angin mulai diimplementasikan di berbagai daerah terpencil untuk menyediakan listrik bagi penduduk yang selama ini belum terjangkau oleh jaringan pusat kota.",
      questions: [
        { type: "mc", question: "Mengapa energi bersih sangat dibutuhkan saat ini?", options: ["Untuk gaya hidup", "Mencegah pemanasan global", "Karena lebih murah", "Pamer teknologi"], correctAnswers: [1], barrettLevel: "literal" },
        { type: "cmc", question: "Apa Saja sumber energi bersih yang disebutkan pada bacaan di atas?", options: ["Baterai", "Panel Surya", "Kincir Angin", "Bendungan Air"], correctAnswers: [1, 2], barrettLevel: "literal" },
        { type: "mc", question: "Klasifikasikan teknologi yang disebutkan dalam teks sesuai fungsinya!", options: ["Panel & Kincir untuk Energi", "Mobil untuk Transportasi", "HP untuk Komunikasi"], correctAnswers: [0], barrettLevel: "reorganization" },
        { type: "essay", question: "Apa dampak jangka panjang penggunaan energi bersih bagi bumi?", referenceAnswer: "Mengurangi dampak pemanasan global dan menjaga ekosistem tetap sehat.", barrettLevel: "inferential" },
        { type: "essay", question: "Setujukah kamu jika pemerintah memaksakan transisi energi ke daerah terpencil? Jelaskan pendapatmu!", referenceAnswer: "Setuju, agar semua warga mendapat hak listrik yang merata dan berkelanjutan.", barrettLevel: "evaluative" }
      ]
    },
    {
      id: "D", title: "Kincir Angin Desa", theme: "Level D — Madya", icon: "wind_power", color: "#A78BFA", colorDark: "#7C3AED", image: "/images/stories/comp_D_v2.png",
      text: "Teknisi sedang memasang kincir angin raksasa di lapangan hijau desa kami. Energi angin dirubah menjadi tenaga listrik yang sangat ramah lingkungan untuk menerangi rumah warga. Listrik dari kincir angin ini sangat bersih karena tidak merusak alam maupun mencemari udara desa.",
      questions: [
        { type: "mc", question: "Apa alat yang dipasang teknisi di desa?", options: ["Tiang telepon", "Kincir angin raksasa", "Pabrik kimia", "Sumur bor"], correctAnswers: [1], barrettLevel: "literal" },
        { type: "cmc", question: "Apa keunggulan energi dari kincir angin menurut teks?", options: ["Ramah lingkungan", "Mencemari udara", "Sangat bersih", "Tidak merusak alam"], correctAnswers: [0, 2, 3], barrettLevel: "literal" },
        { type: "mc", question: "Poin ringkasan yang sesuai untuk teks tersebut adalah...", options: ["Listrik ramah lingkungan dari kincir angin", "Pembuatan pabrik di desa", "Lomba lari di lapangan"], correctAnswers: [0], barrettLevel: "reorganization" },
        { type: "essay", question: "Mengapa penulis menyebut tenaga kincir angin itu 'bersih'?", referenceAnswer: "Karena tidak merusak alam maupun mencemari udara.", barrettLevel: "inferential" },
        { type: "essay", question: "Bayangkan jika kamu adalah warga di desa tersebut, apakah kamu akan mendukung pemasangan kincir angin ini? Mengapa?", referenceAnswer: "Mendukung, karena desa akan terang tanpa merusak lingkungan.", barrettLevel: "evaluative" }
      ]
    }
  ],
  "E": [
    {
      id: "E", title: "Hutan Bakau", theme: "Level E — Mahir", icon: "science", color: "#F472B6", colorDark: "#DB2777", image: "/images/stories/fluency_E.png",
      text: "Ekosistem hutan bakau memfasilitasi perlindungan kawasan pesisir dari ancaman erosi melalui struktur perakaran yang sangat kompleks. Habitat ini menjadi esensial bagi berbagai biota laut yang saling bersimbiosis dalam menjaga keseimbangan kehidupan, serta mampu menyaring banyak zat polutan berbahaya dari aliran air sungai sebelum lolos masuk ke laut lepas.",
      questions: [
        { type: "mc", question: "Bagaimana hutan bakau mencegah erosi pesisir?", options: ["Garam laut", "Struktur perakaran yang kompleks", "Menghalau nelayan", "Daun penetralisir"], correctAnswers: [1], barrettLevel: "literal" },
        { type: "cmc", question: "Pilih 3 kegunaan habitat hutan bakau yang dibahas di teks!", options: ["Melindungi dari erosi pesisir", "Menyaring polutan", "Menghasilkan air tawar", "Habitat biota laut", "Menyediakan buah"], correctAnswers: [0, 1, 3], barrettLevel: "literal" },
        { type: "mc", question: "Buatlah matriks manfaat hutan bakau sesuai bacaan!", options: ["Pesisir (Erosi), Biota (Habitat), Air (Polutan)", "Kota (Gedung), Sawah (Padi), Gunung (Pinus)", "Jalan (Mobil), Jembatan (Sungai)"], correctAnswers: [0], barrettLevel: "reorganization" },
        { type: "essay", question: "Apa makna istilah 'simbiosis' dalam menjaga keseimbangan kehidupan di sana?", referenceAnswer: "Hubungan timbal balik antar biota laut yang saling menyokong kehidupan.", barrettLevel: "inferential" },
        { type: "essay", question: "Menurut pendapatmu, kebijakan apa yang paling tepat diambil jika ada pengembang yang ingin mengganti hutan bakau menjadi hotel?", referenceAnswer: "Harus ditolak karena fungsi ekologis hutan bakau tidak bisa digantikan bangunan fisik.", barrettLevel: "evaluative" }
      ]
    },
    {
      id: "E", title: "Siklus Air", theme: "Level E — Mahir", icon: "water_drop", color: "#F472B6", colorDark: "#DB2777", image: "/images/stories/comp_E_v2.png",
      text: "Siklus air di bumi dimulai dari penguapan air laut secara masif akibat radiasi panas matahari. Uap air yang membubung tinggi kemudian terkondensasi membentuk gumpalan awan tebal hingga akhirnya jatuh kembali ke bumi sebagai presipitasi atau hujan. Proses ini sangat vital karena mendistribusikan air bersih ke seluruh daratan untuk menopang kehidupan flora dan fauna.",
      questions: [
        { type: "mc", question: "Apa yang menyebabkan air laut menguap?", options: ["Angin kencang", "Awan mendung", "Panas matahari", "Gaya gravitasi"], correctAnswers: [2], barrettLevel: "literal" },
        { type: "cmc", question: "Apa peran vital siklus air bagi kehidupan di bumi?", options: ["Mendistribusi air bersih", "Menopang flora dan fauna", "Mendinginkan matahari", "Mengisi daratan"], correctAnswers: [0, 1], barrettLevel: "literal" },
        { type: "mc", question: "Urutkan proses siklus air yang terjadi!", options: ["Penguapan - Kondensasi - Presipitasi", "Presipitasi - Penguapan - Awan", "Awan - Laut - Matahari"], correctAnswers: [0], barrettLevel: "reorganization" },
        { type: "essay", question: "Apa yang akan terjadi jika proses kondensasi tidak pernah terjadi?", referenceAnswer: "Awan tidak akan terbentuk dan hujan tidak akan pernah turun.", barrettLevel: "inferential" },
        { type: "essay", question: "Setelah memahami siklus air, bagaimana sikapmu terhadap penggunaan air di rumah agar siklus ini tetap terjaga manfaatnya?", referenceAnswer: "Hemat air dan menjaga lingkungan agar air tanah tetap jernih.", barrettLevel: "evaluative" }
      ]
    }
  ]
};

const LEVEL_CHARACTERISTICS: Record<string, any> = {
  "A": {
    id: "A", name: "Pembaca Dini", age: "0–7 tahun", symbol: "Bintang", color: "#FF4757",
    kpmRange: "0–30 KPM",
    metamorphosisImg: "https://i.ibb.co.com/RptQhrgk/A.png",
    ability: "Baru mengenal buku, belum mampu membaca sendiri, memerlukan pendampingan intensif (scaffolding).",
    content: "Fokus pada pengenalan diri, lingkungan sekitar, dan konsep konkret.",
    language: "Kosakata sederhana (5–20 kata), maks 5 kata per kalimat, maks 3 kalimat per halaman.",
    visual: "Gambar sangat dominan, tidak menggunakan balon dialog."
  },
  "B1": {
    id: "B1", name: "Pembaca Awal", age: "6–8 tahun", symbol: "Lingkaran", color: "#8E44AD",
    kpmRange: "30–50 KPM",
    metamorphosisImg: "https://i.ibb.co.com/ZRcw6TTW/B.png",
    ability: "Mampu memahami alur tulisan sederhana dan mengenali lingkungan sekitar.",
    content: "Kisah harian yang akrab dengan dunia anak (Literal: 1-2 indikator SD).",
    language: "Maksimal 7 kata per kalimat, maksimal 5 kalimat per halaman.",
    visual: "Gambar masih dominan namun teks mulai bertambah."
  },
  "B2": {
    id: "B2", name: "Pembaca Awal", age: "7–9 tahun", symbol: "Lingkaran", color: "#8E44AD",
    kpmRange: "50–70 KPM",
    metamorphosisImg: "https://i.ibb.co.com/ZRcw6TTW/B.png",
    ability: "Memahami tema yang lebih kompleks seperti sejarah sederhana atau cara kerja sesuatu.",
    content: "Pengenalan konsep sejarah, alam, atau sains sederhana (Target SD Kelas 2).",
    language: "Maksimal 9 kata per kalimat, maksimal 7 kalimat per halaman.",
    visual: "Gambar mendukung teks yang lebih panjang."
  },
  "B3": {
    id: "B3", name: "Pembaca Awal", age: "8–10 tahun", symbol: "Lingkaran", color: "#8E44AD",
    kpmRange: "70–90 KPM",
    metamorphosisImg: "https://i.ibb.co.com/ZRcw6TTW/B.png",
    ability: "Mampu membaca buku berbab (chapter book) dan memahami paragraf sederhana.",
    content: "Cerita fiksi atau non-fiksi pendek dengan struktur paragraf (Target SD Kelas 3).",
    license: "Taksonomi Barrett: Fokus Reorganisasi & Inferensial dasar.",
    language: "Maksimal 12 kata per kalimat, maksimal 3 paragraf per halaman.",
    visual: "Ilustrasi sebagai pemanis, teks mulai dominan."
  },
  "C": {
    id: "C", name: "Pembaca Semenjana", age: "10–13 tahun", symbol: "Lingkaran", color: "#1E3A8A",
    kpmRange: "90–110 KPM",
    metamorphosisImg: "https://i.ibb.co.com/h1CsCtdN/C.png",
    ability: "Sudah lancar membaca wacana, mampu berpikir logis, dan mulai belajar secara mandiri.",
    content: "Ilmu pengetahuan umum dan narasi yang lebih berbobot (Target SD Kelas 4).",
    language: "Variasi kalimat tunggal/majemuk, berbagai jenis paragraf. Kosakata > 300 kata.",
    visual: "Foto, grafik, atau infografik. Balon dialog diperbolehkan."
  },
  "D": {
    id: "D", name: "Pembaca Madya", age: "13–15 tahun", symbol: "Segitiga", color: "#22C55E",
    kpmRange: "110–130 KPM",
    metamorphosisImg: "https://i.ibb.co.com/G3W8wFSf/D.png",
    ability: "Memahami teks tingkat kesulitan menengah, menguatkan minat bakat, dan kesadaran bermasyarakat.",
    content: "Konsep dasar keilmuan, isu sosial, dan evaluasi krusial (Target SD Kelas 5).",
    language: "Kosakata kompleks (> 600 kata), kata serapan, kalimat majemuk bertingkat.",
    visual: "Grafik kompleks atau tanpa ilustrasi."
  },
  "E": {
    id: "E", name: "Pembaca Mahir", age: "16+ tahun", symbol: "Segi Empat", color: "#FACC15",
    kpmRange: "130–150+ KPM",
    metamorphosisImg: "https://i.ibb.co.com/t01VSX5/E.png",
    ability: "Mampu membaca analitis/kritis, menyintesis berbagai sumber, dan memahami keilmuan lanjutan.",
    content: "Sastra analitis, ensiklopedia, dan pemahaman evaluatif tingkat tinggi (Target SD Kelas 6).",
    language: "Kosakata bidang keilmuan khusus (> 900 kata), struktur bahasa kompleks.",
    visual: "Teks teknis, data statistik, atau tanpa ilustrasi."
  }
};

const LEVELS_IDS = ["A", "B", "C", "D", "E"];


// --- Sub-Components ---

const TypewriterText = ({ text, delay = 35 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");
  useEffect(() => {
    let i = 0;
    setDisplayedText("");
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(timer);
      }
    }, delay);
    return () => clearInterval(timer);
  }, [text, delay]);
  return <span>{displayedText}</span>;
};

// --- Certificate Template (Redesigned for Stability) ---
const CertificateTemplate = React.forwardRef<HTMLDivElement, { 
  profileName: string; 
  levelData: any; 
  fluencyData: any; 
  compScore: number | null;
}>(({ profileName, levelData, fluencyData, compScore }, ref) => {
  const certificateId = useMemo(() => {
    const random = Math.floor(1000 + Math.random() * 9000);
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    return `RD-${date}-${random}`;
  }, []);

  return (
    <div style={{ position: 'fixed', left: '-9999px', top: '0', zIndex: -100 }}>
      <div 
        ref={ref}
        id="certificate-content"
        className="bg-white relative"
        style={{ 
          width: '1122px', 
          height: '793px',
          padding: '60px',
          boxSizing: 'border-box',
          overflow: 'hidden'
        }}
      >
        {/* Premium Border System */}
        <div className="absolute inset-0 border-[30px] border-[#1E3A8A] m-4 opacity-10"></div>
        <div className="absolute inset-0 border-[4px] border-[#F6C000] m-12"></div>
        <div className="absolute inset-0 border-[1px] border-[#1E3A8A] m-14 opacity-20"></div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1E3A8A 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F6C000] opacity-5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#87CEEB] opacity-5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>

        <div className="relative h-full flex flex-col items-center justify-between py-4 text-center">
          
          {/* Header Section */}
          <div className="w-full">
            <h1 className="text-[44px] font-black text-[#1E3A8A] mb-2 tracking-[10px]" style={{ lineHeight: '1.2' }}>
              SERTIFIKAT PENCAPAIAN
            </h1>
            <h2 className="text-[18px] font-bold text-[#5AAFD1] tracking-[4px] uppercase">
              DIAGNOSIS KEMAMPUAN MEMBACA
            </h2>
            <div className="flex items-center justify-center gap-4 mt-6">
               <div className="h-[2px] w-32 bg-[#F6C000]"></div>
               <div className="w-3 h-3 rotate-45 bg-[#1E3A8A]"></div>
               <div className="h-[2px] w-32 bg-[#F6C000]"></div>
            </div>
          </div>

          {/* Main Body Section */}
          <div className="w-full mt-4">
            <p className="text-[18px] font-medium text-[#666666] mb-6 italic" style={{ letterSpacing: '1px' }}>
              Diberikan dengan bangga kepada:
            </p>
            <h3 className="text-[64px] font-black text-[#333333] mb-8 leading-none" style={{ textShadow: '2px 2px 0 rgba(0,0,0,0.05)' }}>
              {profileName}
            </h3>
            <p className="text-[16px] text-[#555555] max-w-3xl mx-auto leading-relaxed mb-8">
              Atas keberhasilannya dalam menyelesaikan asesmen membaca Readify <br/> 
              dan mencapai tingkat kompetensi literasi:
            </p>

            {/* Level Badge Box */}
            <div className="inline-flex items-center gap-8 bg-white border-4 border-[#F6C000] p-6 rounded-[32px] shadow-xl relative mt-2">
               <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#F6C000] rotate-45 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
               </div>
               
               <div 
                 className="w-20 h-20 flex items-center justify-center text-4xl font-black text-white rounded-2xl shadow-inner"
                 style={{ backgroundColor: levelData.color }}
               >
                 {levelData.id}
               </div>

               <div className="text-left pr-4">
                 <p className="text-[14px] font-black text-[#F6C000] uppercase tracking-widest mb-1">JENJANG {levelData.id}</p>
                 <h4 className="text-[32px] font-black text-[#333333] tracking-tight uppercase leading-none">{levelData.name}</h4>
               </div>

               {levelData.metamorphosisImg && (
                  <div className="pl-6 border-l-2 border-[#E2E8F0]">
                     <img src={levelData.metamorphosisImg} className="w-20 h-20 object-contain" alt="Mascot" />
                  </div>
               )}
            </div>
          </div>

          {/* Metrics & Analysis Grid */}
          <div className="w-full grid grid-cols-12 gap-8 mt-12 px-12 text-left">
             {/* Left: Metrics */}
             <div className="col-span-5 grid grid-cols-3 gap-3">
                <div className="bg-[#F8FAFC] p-4 rounded-2xl border-b-4 border-[#34D399] text-center">
                   <p className="text-[10px] font-black text-[#A0AEC0] uppercase mb-1">Akurasi</p>
                   <p className="text-2xl font-black text-[#34D399]">{fluencyData.accuracy}%</p>
                </div>
                <div className="bg-[#F8FAFC] p-4 rounded-2xl border-b-4 border-[#87CEEB] text-center">
                   <p className="text-[10px] font-black text-[#A0AEC0] uppercase mb-1">Kecepatan</p>
                   <p className="text-2xl font-black text-[#87CEEB]">{fluencyData.wpm}</p>
                   <p className="text-[8px] font-bold text-[#A0AEC0]">WPM</p>
                </div>
                <div className="bg-[#F8FAFC] p-4 rounded-2xl border-b-4 border-[#FFB347] text-center">
                   <p className="text-[10px] font-black text-[#A0AEC0] uppercase mb-1">Skor</p>
                   <p className="text-2xl font-black text-[#FFB347]">{compScore || '-'}</p>
                </div>
             </div>

             {/* Right: Analysis Snippets */}
             <div className="col-span-7 flex flex-col gap-3">
                <div className="bg-[#F8FAFC] p-4 rounded-2xl border-l-[6px] border-[#87CEEB]">
                   <h5 className="text-[10px] font-black text-[#1E3A8A] uppercase mb-1">Profil Kemampuan</h5>
                   <p className="text-[12px] text-[#4A5568] leading-tight line-clamp-2">{levelData.ability}</p>
                </div>
                <div className="bg-[#FCF9EE] p-4 rounded-2xl border-l-[6px] border-[#F6C000]">
                   <h5 className="text-[10px] font-black text-[#B45309] uppercase mb-1">Karakteristik Teks</h5>
                   <p className="text-[12px] text-[#4A5568] leading-tight line-clamp-2">{levelData.language}</p>
                </div>
             </div>
          </div>

          <div className="w-full px-12 mt-8">
             <p className="text-[12px] font-bold text-[#4A5568] italic opacity-80 leading-relaxed border-t-2 border-[#F1F5F9] pt-4">
                "Selamat! Kemampuan membacamu selaras dengan karakteristik {levelData.name.toLowerCase()}. Terus pertahankan kebiasaan membacamu!"
             </p>
          </div>

          {/* Footer Area */}
          <div className="w-full flex items-end justify-between px-12 mt-auto">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-[#F0F8FF] rounded-full border-4 border-[#87CEEB] flex items-center justify-center p-3">
                <img src="/images/logo.png" className="w-full h-full object-contain opacity-40 rotate-[-15deg]" alt="Seal" />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-[#64748B] uppercase mb-1 tracking-widest">ID SERTIFIKAT</p>
                <p className="text-sm font-mono font-bold text-[#1E3A8A]">{certificateId}</p>
              </div>
            </div>

            <div className="text-center relative">
               <div className="w-40 h-10 flex flex-col items-center justify-center border-2 border-dashed border-[#CBD5E0] mb-3 bg-[#F8FAFC] p-1">
                  <div className="w-full h-1 bg-[#1E3A8A] mb-0.5 mt-auto opacity-40"></div>
                  <div className="w-[80%] h-1 bg-[#1E3A8A] mb-0.5 opacity-60"></div>
                  <div className="w-full h-1 bg-[#1E3A8A] mb-1 opacity-40"></div>
                  <p className="text-[6px] font-mono font-bold tracking-[2px] mb-auto">RD-{certificateId.split('-')[2]}</p>
               </div>
               <div className="h-[2px] w-32 bg-[#333333] mx-auto mb-1"></div>
               <p className="text-xs font-black text-[#333333] uppercase">Tim Evaluasi Readify</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

CertificateTemplate.displayName = "CertificateTemplate";

// --- Main Page ---

export default function IntegratedDiagnosticPage() {
  const { profile, logout, getAvatarUrl } = useProfile();
  const router = useRouter();

  // Unified State Machine
  // journey -> fluency_reading -> fluency_intermission -> decision -> comp_reading -> result
  const [step, setStep] = useState<string>("fluency_reading");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Content Pool State (Randomized per session/start)
  const [selectedLevels, setSelectedLevels] = useState<any[]>([]);
  const [selectedStory, setSelectedStory] = useState<any | null>(null);

  // Fluency State
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [fluencyHistory, setFluencyHistory] = useState<{accuracy: number, wpm: number, levelId: string}[]>([]);
  const [isReading, setIsReading] = useState(false);
  const [matchedIndices, setMatchedIndices] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [startTime, setStartTime] = useState<number | null>(null);
  const recognitionRef = useRef<any>(null);

  // Comprehension State
  const [showQuestions, setShowQuestions] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [compAnswers, setCompAnswers] = useState<any[]>([]);
  const [essayResults, setEssayResults] = useState<Record<number, {score: number, feedback: string}>>({});
  const [isGrading, setIsGrading] = useState(false);
  const [compScore, setCompScore] = useState<number | null>(null);
  const [barrettMastery, setBarrettMastery] = useState<Record<string, number>>({ 
    literal: 0, 
    reorganization: 0, 
    inferential: 0, 
    evaluative: 0 
  });

  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const certificateRef = useRef<HTMLDivElement>(null);

  const handleDownloadCertificate = async () => {
    if (!certificateRef.current) return;
    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // High resolution
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [1122, 793]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, 1122, 793);
      pdf.save(`Sertifikat_Readify_${profile.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("PDF Generation failed", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // --- Randomization Logic ---
  const initializePool = () => {
    // Pick one random variation for each level A-E
    const levels = LEVELS_IDS.map(id => {
      const vars = LEVEL_VARIATIONS[id];
      return vars[Math.floor(Math.random() * vars.length)];
    });
    setSelectedLevels(levels);
    // Story will be picked later based on final fluency level
  };

  useEffect(() => {
    initializePool();
  }, []);

  // --- Speech Recognition Logic ---
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR && selectedLevels.length > 0) {
      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = "id-ID";
      rec.onresult = (event: any) => {
         let fullTranscript = "";
         for (let i = 0; i < event.results.length; ++i) {
            fullTranscript += event.results[i][0].transcript + " ";
         }
         const currentLevel = selectedLevels[currentLevelIdx];
         const currentText = currentLevel.text.toLowerCase().split(" ");
         const words = fullTranscript.toLowerCase().split(/\s+/).filter(Boolean);
         const nextMatched: number[] = [];
         let textCursor = 0;
         words.forEach(w => {
            const cleanW = w.replace(/[.,!?]/g, "").trim();
            if (!cleanW) return;
            for (let i = textCursor; i < Math.min(textCursor + 4, currentText.length); i++) {
               const targetClean = currentText[i].replace(/[.,!?]/g, "").trim().toLowerCase();
               if (targetClean === cleanW && !nextMatched.includes(i)) {
                  nextMatched.push(i);
                  textCursor = i + 1;
                  break;
               }
            }
         });
         setMatchedIndices(nextMatched.sort((a, b) => a - b));
      };
      recognitionRef.current = rec;
    }
  }, [currentLevelIdx, selectedLevels]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isReading && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      stopFluencyReading();
    }
    return () => clearInterval(timer);
  }, [isReading, timeLeft]);

  // --- Fluency Actions ---
  const startDiagnostic = () => {
    initializePool(); // Fresh shuffle on start
    setCurrentLevelIdx(0);
    setFluencyHistory([]);
    if (selectedLevels.length > 0) {
      setTimeLeft(LEVEL_VARIATIONS["A"][0].time); // Use first var's time as default for init
    } else {
      setTimeLeft(30);
    }
    setStep("fluency_reading");
  };

  // Sync timeLeft when selectedLevels is ready
  useEffect(() => {
    if (selectedLevels.length > 0 && step === "fluency_reading") {
       setTimeLeft(selectedLevels[currentLevelIdx].time);
    }
  }, [selectedLevels, currentLevelIdx, step]);

  const startFluencyReading = () => {
    setIsReading(true);
    setMatchedIndices([]);
    setStartTime(Date.now());
    if (recognitionRef.current) recognitionRef.current.start();
  };

  const stopFluencyReading = () => {
    setIsReading(false);
    const duration = startTime ? (Date.now() - startTime) / 1000 : 1;
    if (recognitionRef.current) recognitionRef.current.stop();

    const level = selectedLevels[currentLevelIdx];
    const totalWords = level.text.split(" ").length;
    const matchCount = matchedIndices.length;
    const acc = Math.round((matchCount / totalWords) * 100);
    const wpm = Math.round((matchCount / duration) * 60);

    const newResult = { accuracy: acc, wpm: wpm, levelId: level.id };
    const nextHistory = [...fluencyHistory, newResult];
    setFluencyHistory(nextHistory);

    if (acc >= 80 && currentLevelIdx < selectedLevels.length - 1) {
      setStep("fluency_intermission");
    } else {
      // DECISION BRIDGE
      const finalLevel = level.id;
      if (finalLevel === 'A') {
        setStep("result");
      } else {
        // Determine sub-level for B comprehension
        let subLevel = "B-1";
        if (finalLevel === 'B') {
           if (wpm > 80 && acc > 95) subLevel = "B-3";
           else if (wpm > 60) subLevel = "B-2";
           else subLevel = "B-1";
        } else {
           subLevel = finalLevel; // C, D, E mapped directly
        }

        const possibleStories = STORY_VARIATIONS[subLevel] || STORY_VARIATIONS["B-1"];
        const pick = possibleStories[Math.floor(Math.random() * possibleStories.length)];
        setSelectedStory(pick);
        setStep("decision");
      }
    }
  };

  const nextFluencyLevel = () => {
    const next = currentLevelIdx + 1;
    setCurrentLevelIdx(next);
    setTimeLeft(selectedLevels[next].time);
    setMatchedIndices([]);
    setStep("fluency_reading");
  };

  // --- Comprehension Actions ---
  const startComprehension = () => {
    if (!selectedStory) return;
    setCompAnswers(selectedStory.questions.map((q:any) => q.type === 'cmc' ? [] : q.type === 'essay' ? "" : null));
    setEssayResults({});
    setCurrentQuestionIdx(0);
    setShowQuestions(false);
    setStep("comp_reading");
  };

  const handleGradeEssay = async () => {
    if (!selectedStory) return;
    setIsGrading(true);
    const q = selectedStory.questions[currentQuestionIdx];
    const ans = compAnswers[currentQuestionIdx];
    const res = await gradeEssayAction(selectedStory.text, q.question, ans, q.referenceAnswer || "");
    setEssayResults(prev => ({ ...prev, [currentQuestionIdx]: res }));
    setIsGrading(false);
  };

  const finishComprehension = () => {
    if (!selectedStory) return;
    
    const masteryTemp: Record<string, number[]> = {
      literal: [],
      reorganization: [],
      inferential: [],
      evaluative: []
    };

    let totalScore = 0;
    selectedStory.questions.forEach((q:any, i:number) => {
      let qScore = 0;
      if (q.type === 'mc') {
        if (compAnswers[i] === q.correctAnswers![0]) qScore = 100;
      } else if (q.type === 'cmc') {
        const corrects = q.correctAnswers!;
        const arr = compAnswers[i] as number[];
        let matches = 0, misses = 0;
        arr.forEach(a => corrects.includes(a) ? matches++ : misses++);
        qScore = Math.max(0, (matches / corrects.length) * 100 - (misses * 50));
      } else if (q.type === 'essay') {
        qScore = essayResults[i]?.score || 0;
      }
      
      totalScore += qScore;
      if (q.barrettLevel && masteryTemp[q.barrettLevel]) {
        masteryTemp[q.barrettLevel].push(qScore);
      }
    });

    // Calculate mastery per barrett level
    const masteryFinal: Record<string, number> = {};
    Object.keys(masteryTemp).forEach(level => {
      const scores = masteryTemp[level];
      masteryFinal[level] = scores.length > 0 ? Math.round(scores.reduce((a,b) => a+b, 0) / scores.length) : 0;
    });

    setBarrettMastery(masteryFinal);
    setCompScore(Math.round(totalScore / selectedStory.questions.length));
    setStep("result");
  };

  // --- Calculations ---
  const getFinalPedagogicalData = () => {
    const level = selectedLevels[currentLevelIdx] || { id: 'A' };
    let targetId = level.id;
    
    // Detailed mapping for B sub-levels
    if (targetId === 'B' && selectedStory) {
      if (selectedStory.id === 'B-1') targetId = 'B1';
      else if (selectedStory.id === 'B-2') targetId = 'B2';
      else if (selectedStory.id === 'B-3') targetId = 'B3';
    }

    return LEVEL_CHARACTERISTICS[targetId] || LEVEL_CHARACTERISTICS['A'];
  };

  const finalLevelData = getFinalPedagogicalData();
  const finalFluency = useMemo(() => {
    if (fluencyHistory.length === 0) return { accuracy: 0, wpm: 0 };
    const sumAcc = fluencyHistory.reduce((sum, item) => sum + (item.accuracy || 0), 0);
    const sumWpm = fluencyHistory.reduce((sum, item) => sum + (item.wpm || 0), 0);
    return {
      accuracy: Math.round(sumAcc / fluencyHistory.length),
      wpm: Math.round(sumWpm / fluencyHistory.length)
    };
  }, [fluencyHistory]);

  // Comprehensive Fluency Rubric Score (1-16)
  const fluencyRubric = useMemo(() => {
    if (step !== "result") return null;
    
    // Scoring Accuracy (1-4)
    const acc = finalFluency.accuracy;
    const accScore = acc >= 95 ? 4 : acc >= 85 ? 3 : acc >= 70 ? 2 : 1;
    
    // Scoring Rate (1-4) based on KPM target
    const wpm = finalFluency.wpm;
    const kpmRange = finalLevelData.kpmRange?.match(/\d+/g)?.map(Number) || [0, 30];
    const targetMin = kpmRange[0];
    const targetMax = kpmRange[1];
    
    let rateScore = 1;
    if (wpm >= targetMax) rateScore = 4;
    else if (wpm >= targetMin) rateScore = 3;
    else if (wpm >= targetMin / 2) rateScore = 2;
    
    // Simulated Prosody & Automaticity (Indonesian Standards)
    // AI simulates these based on accuracy-speed consistency
    const autoScore = Math.max(1, Math.min(4, Math.floor((accScore + rateScore) / 2 + (acc > 90 ? 0.5 : 0))));
    const prosodyScore = Math.max(1, Math.min(4, Math.floor((accScore + rateScore) / 2 + (wpm > targetMin ? 0.5 : 0))));
    
    const total = accScore + rateScore + autoScore + prosodyScore;
    let label = "Tidak Lancar";
    if (total >= 13) label = "Sangat Lancar";
    else if (total >= 9) label = "Lancar";
    else if (total >= 5) label = "Kurang Lancar";

    return {
      accuracy: accScore,
      rate: rateScore,
      automaticity: autoScore,
      prosody: prosodyScore,
      total,
      label
    };
  }, [step, finalFluency, finalLevelData]);

  
  const recommendations = useMemo(() => {
    if (step !== "result") return [];
    const searchCode = finalLevelData.id
      .replace('B1', 'B-1')
      .replace('B2', 'B-2')
      .replace('B3', 'B-3');

    return BOOKS.filter(b => {
      const parts = b.level.split(" ");
      const lastPart = parts[parts.length - 1];
      return lastPart === searchCode;
    }).slice(0, 4);
  }, [step, finalLevelData.id]);

  const smartAdvice = useMemo(() => {
    if (step !== "result") return "";
    const adv = [];
    if (finalFluency.accuracy < 85) adv.push("Fokus pada kejelasan pengucapan setiap kata, jangan terburu-buru.");
    if (finalFluency.wpm < 60 && finalLevelData.id !== 'A') adv.push("Cobalah membaca teks yang sama berulang kali untuk melatih kecepatan.");
    if (compScore !== null && compScore < 70) adv.push("Setelah membaca satu paragraf, coba ceritakan kembali isinya dengan bahasamu sendiri.");
    
    // Add Barrett-specific advice
    if (barrettMastery.evaluative < 60) adv.push("Latihlah keberanianmu dalam memberikan pendapat tentang sikap tokoh di dalam cerita.");
    if (barrettMastery.reorganization < 60) adv.push("Cobalah untuk meringkas urutan kejadian setelah membaca sebuah cerita pendek.");

    if (adv.length === 0) return "Luar biasa! Pertahankan bakat membacamu dan terus eksplorasi buku-buku baru.";
    return adv.join(" ");
  }, [step, finalFluency, finalLevelData, compScore, barrettMastery]);

  // --- Render Helpers ---
  const currentLevel = selectedLevels[currentLevelIdx];
  const currentStory = selectedStory;

  return (
    <div className="min-h-screen bg-[#F0F8FF] font-body text-[#333333] relative overflow-x-hidden">
       {/* Top Navbar */}
       <nav className="fixed top-0 left-0 right-0 z-[100] bg-white border-b-4 border-[#E2E8F0] shadow-sm animate-bounce-in">
         <div className="max-w-6xl mx-auto px-6 md:px-8 py-3 flex items-center justify-between">
           <Link href="/" className="hover:scale-105 transition-transform flex items-center shrink-0">
             <Image src="https://i.ibb.co.com/cXwhYkn7/Desain-tanpa-judul-21.png" alt="Readify Logo" width={110} height={35} className="object-contain drop-shadow-md" />
           </Link>

           <div className="flex items-center gap-2 md:gap-4 lg:gap-6">
              {/* Desktop Nav Links */}
              <div className="hidden md:flex items-center gap-2">
                 <Link href="/explore/library" className="px-5 py-2 rounded-3xl bg-white text-[#A0AEC0] border-4 border-transparent hover:border-[#E2E8F0] hover:bg-[#F8FAFC] flex items-center gap-2 font-bold text-xs uppercase tracking-wide transition-all group">
                   <span className="material-symbols-rounded text-lg group-hover:text-[#FFB347]">auto_stories</span>
                   <span>Perpustakaan</span>
                 </Link>
                 <Link href="/explore/diagnostic" className="px-5 py-2 rounded-3xl bg-[#FFB347] text-white border-4 border-[#E69A2E] shadow-[0_4px_0_#E69A2E] flex items-center gap-2 font-bold text-xs uppercase tracking-wide transition-all">
                   <span className="material-symbols-rounded text-lg">stairs</span>
                   <span>Diagnosis Membaca</span>
                 </Link>
              </div>

              {/* Hamburger Button (Mobile Only) */}
              <button 
                 onClick={() => setIsMenuOpen(true)}
                 className="flex md:hidden w-10 h-10 items-center justify-center rounded-xl bg-[#F8FAFC] text-[#5AAFD1] border-2 border-[#E2E8F0] hover:bg-white transition-all shadow-sm active:scale-95"
              >
                 <span className="material-symbols-rounded text-2xl font-bold">menu</span>
              </button>

              {/* Profile & Logout (Desktop style adapted) */}
              <div className="flex items-center gap-2 md:gap-3 bg-[#F0F8FF] px-2 md:px-4 py-1.5 rounded-full border-2 border-[#E2E8F0] shadow-inner ml-1">
                 <div className="w-8 h-8 rounded-full bg-white border-2 border-[#FFB347] overflow-hidden flex items-center justify-center shrink-0">
                   <img src={getAvatarUrl()} alt="User Avatar" className="w-full h-full object-cover" />
                 </div>
                 <div className="hidden sm:block">
                    <p className="text-[9px] font-black text-[#A0AEC0] tracking-widest leading-none mb-0.5">Petualang</p>
                    <h4 className="text-[11px] font-black text-[#5AAFD1] truncate tracking-wide max-w-[80px] md:max-w-[100px]">{profile.name}</h4>
                 </div>
                 <button 
                   onClick={async () => { await logout(); router.push("/"); }}
                   className="hidden md:flex ml-2 items-center justify-center w-8 h-8 rounded-full hover:bg-white text-[#FF4757]/60 hover:text-[#FF4757] transition-all group border-2 border-transparent hover:border-[#FF4757]/20"
                   title="Keluar"
                 >
                    <span className="material-symbols-rounded text-base group-hover:rotate-12 transition-transform">logout</span>
                 </button>
              </div>
           </div>
         </div>
       </nav>

       {/* Mobile Sidebar */}
       <MobileNav 
         isOpen={isMenuOpen} 
         onClose={() => setIsMenuOpen(false)} 
         profileName={profile.name}
         avatarUrl={getAvatarUrl()}
         onLogout={async () => { await logout(); router.push("/"); }}
       />

       {/* Main Layout Content */}
       <main className="w-full max-w-6xl mx-auto mt-32 px-6 md:px-8 pb-32 relative z-50">
         


         {/* 2. Fluency Reading */}
         {step === "fluency_reading" && selectedLevels.length > 0 && (
            <div className="animate-bounce-in max-w-6xl mx-auto">
               <div className="card-bubbly bg-[#FFFAF0] p-8 md:p-12 min-h-[400px] flex flex-col justify-between relative overflow-hidden">
                  {/* Integrated Header - Badge & Timer */}
                  <div className="flex justify-between items-center mb-10">
                     <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-full border-4 border-[#E2E8F0] shadow-sm">
                        <div className="w-10 h-10 bg-[#FFB347] rounded-full flex items-center justify-center text-white font-black text-xl border-2 border-white shadow-sm">{currentLevel?.id}</div>

                        <div className="text-left font-black uppercase">
                           <p className="text-[9px] text-[#A0AEC0] tracking-widest leading-none mb-0.5">Kelancaran</p>
                           <h4 className="text-sm text-[#333333]">{currentLevel.title}</h4>
                        </div>
                     </div>
                     <div className={`flex items-center gap-2 px-6 py-3 rounded-full font-black text-2xl border-4 transition-all ${timeLeft < 10 ? 'bg-[#FF4757] border-[#D63031] text-white animate-bounce' : 'bg-white border-[#E2E8F0] text-[#FFB347]'}`}>
                        <span className="material-symbols-rounded text-2xl">timer</span>{timeLeft}s
                     </div>
                  </div>
                  
                  <div className="grid md:grid-cols-12 gap-10 items-center">
                      <div className="md:col-span-4 relative aspect-square rounded-3xl overflow-hidden border-4 border-white shadow-md bg-[#F8FAFC]">
                        {currentLevel?.image && <Image src={currentLevel.image} alt="Illust" fill className="object-cover" unoptimized />}
                      </div>
                     <div className="md:col-span-8">
                        <p className="text-2xl md:text-[32px] font-bold leading-[1.8] flex flex-wrap gap-x-3 gap-y-4">
                           {currentLevel?.text.split(" ").map((w: string, i: number) => {
                              const match = matchedIndices.includes(i);
                              return <span key={i} className={`relative transition-all ${match ? 'text-[#34D399] scale-105' : 'text-[#A0AEC0] grayscale'}`}>{w}{match && <span className="absolute -bottom-1 left-0 w-full h-1 bg-[#34D399] rounded-full"></span>}</span>
                           })}
                        </p>
                     </div>
                  </div>
                  <div className="mt-12 flex justify-center items-center gap-8">
                     {!isReading ? (
                        <button onClick={startFluencyReading} className="btn-bubbly px-12 py-5 bg-[#FFB347] flex items-center gap-3 shadow-[0_6px_0_#E69A2E]">Mulai Membaca <span className="material-symbols-rounded">mic</span></button>
                     ) : (
                        <>
                          {/* Animated Mic Indicator - Red Theme, Static Mic, Active Effects */}
                          <div className="relative w-14 h-14 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full bg-[#FF4757] opacity-20 animate-ping"></div>
                            <div className="absolute inset-1 rounded-full bg-[#FF4757] opacity-30 animate-pulse" style={{ animationDuration: '1.2s' }}></div>
                            <div className="relative w-10 h-10 bg-[#FF4757] rounded-full border-2 border-[#D63031] shadow-md flex items-center justify-center z-10">
                              <span className="material-symbols-rounded text-white text-xl">mic</span>
                            </div>
                          </div>

                          <button onClick={stopFluencyReading} className="btn-bubbly px-12 py-5 !bg-[#34D399] !shadow-[0_6px_0_#059669] flex items-center gap-3">Selesai <span className="material-symbols-rounded">check_circle</span></button>
                        </>
                     )}
                  </div>
               </div>
            </div>
         )}

         {/* 3. Intermission */}
         {step === "fluency_intermission" && (
            <div className="animate-bounce-in max-w-6xl mx-auto mt-10 text-center">
               <div className="card-bubbly bg-[#FFF3E0] p-12 border-[#FFB347] shadow-[0_30px_60px_rgba(255,179,71,0.15)]">
                  <h2 className="text-4xl font-black text-[#E69A2E] mb-4">Luar Biasa! 🎉</h2>
                  <p className="text-xl font-bold text-[#666666] mb-8">Kamu sangat lancar di Level {currentLevel?.id}! <br/> Siap untuk tantangan yang lebih tinggi?</p>
                  <button onClick={nextFluencyLevel} className="btn-bubbly px-10 py-4 text-lg bg-[#FFB347] mx-auto flex items-center gap-2">LANJUT KE LEVEL {selectedLevels[currentLevelIdx+1]?.id} <span className="material-symbols-rounded">trending_up</span></button>
               </div>
            </div>
         )}

         {/* 4. Decision Transition */}
         {step === "decision" && (
            <div className="animate-bounce-in max-w-6xl mx-auto mt-10 text-center">
               <div className="card-bubbly bg-[#E0F2FE] p-12 border-[#87CEEB] shadow-[0_30px_60px_rgba(135,206,235,0.15)]">
                  <h2 className="text-4xl font-black text-[#5AAFD1] mb-4">Kamu Hebat! 🏆</h2>
                  <p className="text-xl font-bold text-[#666666] mb-8">Kelancaran membacamu sudah di level {currentLevel?.id}. Sekarang, ayo kita uji pemahamanmu dengan satu cerita menarik!</p>

                  <button onClick={startComprehension} className="btn-bubbly px-10 py-4 text-lg bg-[#87CEEB] mx-auto flex items-center gap-2 shadow-[0_6px_0_#5AAFD1]">Lanjut ke Tes Pemahaman <span className="material-symbols-rounded text-2xl">psychology</span></button>
               </div>
            </div>
         )}

         {/* 5. Comprehension Reading & Test */}
         {step === "comp_reading" && (
            <div className="animate-bounce-in max-w-6xl mx-auto">
               <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-3 bg-white border-4 border-[#E2E8F0] px-6 py-2.5 rounded-full shadow-sm mb-4">
                     <span className="material-symbols-rounded text-2xl" style={{color: currentStory?.color}}>{currentStory?.icon}</span>
                     <span className="text-[10px] font-black uppercase tracking-widest text-[#666666]">{currentStory?.theme}</span>
                  </div>
                  <h2 className="text-4xl font-black uppercase text-[#333333]">{currentStory?.title}</h2>
               </div>

               <div className="card-bubbly p-8 md:p-12 mb-10 bg-white">
                  <div className="grid md:grid-cols-12 gap-8 items-center">
                     <div className="md:col-span-5 relative aspect-[4/3] rounded-3xl overflow-hidden border-4 border-[#E2E8F0]">
                        {currentStory?.image && <Image src={currentStory.image} alt="Story" fill className="object-cover" unoptimized />}
                     </div>
                     <div className="md:col-span-7 h-64 overflow-y-auto pr-4 custom-scroll text-lg font-medium leading-[1.8]" style={{textIndent: '2em'}}>
                        {currentStory?.text}
                     </div>
                  </div>
               </div>

               {!showQuestions ? (
                  <div className="flex justify-center"><button onClick={() => setShowQuestions(true)} className="btn-bubbly-secondary px-10 py-4 bg-white !text-[#5AAFD1] border-4 border-[#E2E8F0] hover:border-[#87CEEB] shadow-[0_6px_0_#E2E8F0]">Munculkan Pertanyaan <span className="material-symbols-rounded">expand_more</span></button></div>
               ) : (
                  <div className="card-bubbly p-10 bg-white animate-fade-in-up">
                     <div className="flex items-center justify-between mb-8 border-b-2 border-[#F0F8FF] pb-4">
                        <span className="text-xs font-black uppercase tracking-widest text-[#A0AEC0]">Pertanyaan {currentQuestionIdx+1} / {currentStory?.questions.length}</span>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black" style={{backgroundColor: currentStory?.color}}>{currentQuestionIdx+1}</div>
                     </div>
                     
                     <h4 className="text-2xl font-black mb-10">{currentStory?.questions[currentQuestionIdx].question}</h4>
                     
                     {currentStory.questions[currentQuestionIdx].type === 'mc' && (
                        <div className="grid sm:grid-cols-2 gap-4">
                           {currentStory.questions[currentQuestionIdx].options?.map((opt: string, i: number) => (
                              <button key={i} onClick={() => { const n = [...compAnswers]; n[currentQuestionIdx] = i; setCompAnswers(n); }} className={`p-4 rounded-2xl border-4 font-bold text-left transition-all ${compAnswers[currentQuestionIdx] === i ? 'bg-[#87CEEB] border-[#87CEEB] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#666666] hover:bg-white'}`}>{opt}</button>
                           ))}
                        </div>
                     )}

                     {currentStory.questions[currentQuestionIdx].type === 'cmc' && (
                        <div className="grid sm:grid-cols-2 gap-4">
                           {currentStory.questions[currentQuestionIdx].options?.map((opt: string, i: number) => {
                              const sel = compAnswers[currentQuestionIdx].includes(i);
                              return <button key={i} onClick={() => { 
                                 const n = [...compAnswers]; 
                                 if (sel) n[currentQuestionIdx] = n[currentQuestionIdx].filter((x: any) => x !== i);
                                 else n[currentQuestionIdx] = [...n[currentQuestionIdx], i].sort();
                                 setCompAnswers(n);
                              }} className={`p-4 rounded-2xl border-4 font-bold text-left transition-all ${sel ? 'bg-[#34D399] border-[#34D399] text-white' : 'bg-[#F8FAFC] border-[#E2E8F0] text-[#666666] hover:bg-white'}`}>{opt}</button>
                           })}
                        </div>
                     )}

                     {currentStory.questions[currentQuestionIdx].type === 'essay' && (
                        <div className="flex flex-col gap-4">
                           <textarea className="w-full h-32 p-4 border-4 border-[#F0F8FF] rounded-2xl outline-none focus:border-[#87CEEB] text-lg font-bold" placeholder="Tulis jawabanmu..." value={compAnswers[currentQuestionIdx]} onChange={(e) => { const n = [...compAnswers]; n[currentQuestionIdx] = e.target.value; setCompAnswers(n); }} disabled={!!essayResults[currentQuestionIdx] || isGrading}></textarea>
                           {!essayResults[currentQuestionIdx] ? (
                              <button onClick={handleGradeEssay} disabled={isGrading || compAnswers[currentQuestionIdx].length < 3} className="self-end px-8 py-3 bg-[#5AAFD1] text-white rounded-full font-black uppercase tracking-widest text-sm shadow-[0_4px_0_#3894B7]">{isGrading ? "Mengoreksi..." : "Cek Jawaban AI"}</button>
                           ) : (
                              <div className="p-4 bg-[#F0F9FF] border-2 border-[#87CEEB] rounded-2xl text-sm font-bold text-[#5AAFD1] animate-bounce-in">{essayResults[currentQuestionIdx].feedback}</div>
                           )}
                        </div>
                     )}

                     <div className="mt-12 flex justify-between">
                        <button onClick={() => setCurrentQuestionIdx(v => Math.max(0, v-1))} disabled={currentQuestionIdx === 0} className="px-6 py-2 text-[#A0AEC0] font-bold uppercase text-xs">Kembali</button>
                        {currentQuestionIdx < (currentStory?.questions.length || 0) - 1 ? (
                           <button onClick={() => setCurrentQuestionIdx(v => v+1)} disabled={compAnswers[currentQuestionIdx] === null || (currentStory?.questions[currentQuestionIdx].type === 'essay' && !essayResults[currentQuestionIdx])} className="px-8 py-3 bg-[#333333] text-white rounded-xl font-black text-sm uppercase">Soal Berikutnya</button>
                        ) : (
                           <button onClick={finishComprehension} disabled={!essayResults[currentQuestionIdx] && currentStory?.questions[currentQuestionIdx].type === 'essay'} className="px-10 py-4 bg-[#FFB347] text-white rounded-xl font-black uppercase text-sm shadow-[0_6px_0_#E69A2E]">Lihat Hasil Akhir!</button>
                        )}
                     </div>
                  </div>
               )}
            </div>
         )}

         {/* 6. Comprehensive Pedagogical Result Step */}
         {step === "result" && (
            <div className="animate-bounce-in max-w-6xl mx-auto">
               <div className="card-bubbly p-10 md:p-16 border-[#E2E8F0] bg-white relative overflow-hidden">
                  
                  {/* Result Header with Custom Symbol */}
                  <div className="flex flex-col md:flex-row items-center gap-12 mb-16 relative z-10 border-b-4 border-[#F0F8FF] pb-12">
                     <div 
                        className="w-48 h-48 flex items-center justify-center text-5xl font-black shadow-2xl border-8 border-white transform relative shrink-0"
                        style={{
                           backgroundColor: finalLevelData.color,
                           color: finalLevelData.id === 'E' ? '#333333' : '#FFFFFF',
                           clipPath: finalLevelData.id === 'A' 
                              ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' 
                              : finalLevelData.id === 'D'
                              ? 'polygon(50% 0%, 0% 100%, 100% 100%)' 
                              : 'none',
                           borderRadius: (finalLevelData.id === 'B' || finalLevelData.id === 'C') 
                              ? '50%' 
                              : finalLevelData.id === 'E' ? '20px' : '0'
                        }}
                     >
                        <span className={finalLevelData.id === 'D' ? 'mt-8' : ''}>{finalLevelData.id}</span>
                     </div>
                     <div className="text-center md:text-left flex-1 relative group/title">
                        <div className="inline-block px-4 py-1.5 bg-[#F0F8FF] rounded-full text-[#5AAFD1] text-xs font-black uppercase tracking-widest mb-4">Profil Diagnostik Readify</div>
                        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-4">
                           <h2 className="text-5xl md:text-7xl font-black text-[#333333] uppercase tracking-tighter leading-none shrink-0">{finalLevelData.name}</h2>
                           {finalLevelData.metamorphosisImg && (
                             <div className="w-24 h-24 md:w-32 md:h-32 pointer-events-none animate-pulse-gentle mx-auto md:mx-0">
                               <img 
                                 src={finalLevelData.metamorphosisImg} 
                                 alt="Metamorphosis Stage" 
                                 className="w-full h-full object-contain filter drop-shadow-2xl"
                               />
                             </div>
                           )}
                        </div>
                         <p className="text-2xl font-bold text-[#666666] leading-relaxed">Selamat {profile.name}! Kemampuan membacamu selaras dengan karakteristik <span className="text-[#5AAFD1] font-black">Jenjang {finalLevelData.id}</span>.</p>
                         
                         <div className="mt-6 flex flex-wrap gap-4">
                            <button 
                               onClick={handleDownloadCertificate}
                               disabled={isGeneratingPDF}
                               className={`px-6 py-3 bg-[#F6C000] text-white rounded-full font-black flex items-center gap-2 shadow-[0_4px_0_#D9A900] hover:-translate-y-0.5 transition-all active:translate-y-1 ${isGeneratingPDF ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                               {isGeneratingPDF ? (
                                  <>PROSES... <span className="animate-spin material-symbols-rounded">sync</span></>
                               ) : (
                                  <>UNDUH SERTIFIKAT <span className="material-symbols-rounded">card_membership</span></>
                               )}
                            </button>
                         </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 relative z-10">
                     <div className="bg-[#F8FAFC] p-8 rounded-[40px] border-4 border-[#E2E8F0] shadow-sm text-center">
                        <p className="text-[10px] font-black text-[#A0AEC0] uppercase mb-4 tracking-widest">Akurasi Kelancaran</p>
                        <p className="text-5xl font-black text-[#34D399] tracking-tighter">{finalFluency.accuracy}%</p>
                     </div>
                     <div className="bg-[#F8FAFC] p-8 rounded-[40px] border-4 border-[#E2E8F0] shadow-sm text-center">
                        <p className="text-[10px] font-black text-[#A0AEC0] uppercase mb-4 tracking-widest">Kecepatan (WPM)</p>
                        <p className="text-5xl font-black text-[#87CEEB] tracking-tighter">{finalFluency.wpm}</p>
                     </div>
                     <div className="bg-[#F8FAFC] p-8 rounded-[40px] border-4 border-[#E2E8F0] shadow-sm text-center">
                        <p className="text-[10px] font-black text-[#A0AEC0] uppercase mb-4 tracking-widest">Skor Pemahaman</p>
                        <p className="text-5xl font-black text-[#FFB347] tracking-tighter">{compScore !== null ? compScore : '-'}</p>
                     </div>
                  </div>

                  <div className="mb-20 relative z-10">
                     <h3 className="text-2xl font-black text-[#333333] mb-8 flex items-center gap-3"><span className="material-symbols-rounded text-3xl text-[#5AAFD1]">analytics</span> Laporan Komprehensif:</h3>
                     
                     <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                        {/* Left: Barrett Taxonomy Breakdown */}
                        <div className="lg:col-span-7 flex flex-col gap-6">
                           <div className="card-bubbly bg-[#F8FAFC] border-[#E2E8F0] p-8">
                              <h4 className="text-sm font-black uppercase tracking-widest text-[#666666] mb-8 flex items-center gap-2">
                                 <span className="material-symbols-rounded text-[#5AAFD1]">psychology</span> Peta Pemahaman (Barrett Taxonomy)
                              </h4>
                              
                              <div className="space-y-8">
                                 {[
                                    { label: 'Pemahaman Literal', val: barrettMastery.literal, icon: 'list_alt', desc: 'Mengenali fakta tersurat dalam teks.', color: '#34D399' },
                                    { label: 'Reorganisasi', val: barrettMastery.reorganization, icon: 'account_tree', desc: 'Mengolah & menyusun ulang informasi.', color: '#87CEEB' },
                                    { label: 'Pemahaman Inferensial', val: barrettMastery.inferential, icon: 'tips_and_updates', desc: 'Menarik kesimpulan dari bacaan.', color: '#A78BFA' },
                                    { label: 'Pemahaman Evaluatif', val: barrettMastery.evaluative, icon: 'gavel', desc: 'Menilai & memberikan argumen kritis.', color: '#F472B6' }
                                 ].map((item, idx) => (
                                    <div key={idx} className="group">
                                       <div className="flex justify-between items-end mb-2">
                                          <div className="flex items-center gap-2">
                                             <span className="material-symbols-rounded text-lg" style={{color: item.color}}>{item.icon}</span>
                                             <div>
                                                <span className="text-xs font-black uppercase text-[#333333] tracking-wide">{item.label}</span>
                                                <p className="text-[10px] font-bold text-[#A0AEC0]">{item.desc}</p>
                                             </div>
                                          </div>
                                          <span className="text-sm font-black" style={{color: item.color}}>{item.val}%</span>
                                       </div>
                                       <div className="w-full h-3 bg-white border-2 border-[#F1F5F9] rounded-full overflow-hidden">
                                          <div className="h-full transition-all duration-1000 ease-out" style={{ width: `${item.val}%`, backgroundColor: item.color }}></div>
                                       </div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>

                        {/* Right: Fluency Indicators */}
                        <div className="lg:col-span-5 flex flex-col gap-6">
                           <div className="card-bubbly bg-[#F8FAFC] border-[#E2E8F0] p-8 h-full">
                              <h4 className="text-sm font-black uppercase tracking-widest text-[#666666] mb-8 flex items-center gap-2">
                                 <span className="material-symbols-rounded text-[#FFB347]">speed</span> Profil Kelancaran (1-16)
                              </h4>

                              <div className="flex flex-col gap-4">
                                 {[
                                    { label: 'Ketepatan', score: fluencyRubric?.accuracy, icon: 'spellcheck' },
                                    { label: 'Kecepatan', score: fluencyRubric?.rate, icon: 'timer' },
                                    { label: 'Kelancaran', score: fluencyRubric?.automaticity, icon: 'bolt' },
                                    { label: 'Intonasi', score: fluencyRubric?.prosody, icon: 'campaign' }
                                 ].map((row, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-white rounded-2xl border-2 border-[#F1F5F9] group hover:border-[#FFB347]/30 transition-all">
                                       <div className="flex items-center gap-3">
                                          <span className="material-symbols-rounded text-[#FFB347]">{row.icon}</span>
                                          <span className="text-xs font-black uppercase text-[#666666] tracking-widest">{row.label}</span>
                                       </div>
                                       <div className="flex gap-1">
                                          {[1, 2, 3, 4].map(star => (
                                             <div key={star} className={`w-3 h-3 rounded-full ${star <= (row.score || 0) ? 'bg-[#FFB347]' : 'bg-[#E2E8F0]'}`}></div>
                                          ))}
                                       </div>
                                    </div>
                                 ))}

                                 <div className="mt-6 pt-6 border-t-2 border-[#F1F5F9] text-center">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-[#A0AEC0] mb-2">Peringkat Akhir</p>
                                    <div className="inline-block px-6 py-2 rounded-full bg-[#FFF7ED] text-[#FFB347] font-black uppercase tracking-tighter text-2xl border-2 border-[#FFEDD5]">
                                       {fluencyRubric?.label}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div className="mb-20 relative z-10">
                     <h3 className="text-2xl font-black text-[#333333] mb-8 flex items-center gap-3"><span className="material-symbols-rounded text-3xl text-[#5AAFD1]">dashboard_customize</span> Karakteristik Jenjangmu:</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="card-bubbly !bg-[#F0F9FF] !border-[#E0F2FE] p-8">
                           <div className="flex items-center gap-3 mb-4 text-[#5AAFD1]">
                              <span className="material-symbols-rounded">psychology</span>
                              <h4 className="font-black uppercase tracking-widest text-sm">Kemampuan & Usia</h4>
                           </div>
                           <p className="text-[#666666] font-bold mb-4">Target Usia: <span className="text-[#333333]">{finalLevelData.age}</span></p>
                           <p className="text-[#333333] font-medium leading-relaxed">{finalLevelData.ability}</p>
                        </div>
                        <div className="card-bubbly !bg-[#FDF2F2] !border-[#FEE2E2] p-8">
                           <div className="flex items-center gap-3 mb-4 text-[#FF4757]">
                              <span className="material-symbols-rounded">menu_book</span>
                              <h4 className="font-black uppercase tracking-widest text-sm">Bahasa & Konten</h4>
                           </div>
                           <p className="text-[#333333] font-medium leading-relaxed mb-4">{finalLevelData.language}</p>
                           <p className="text-[#333333] font-medium leading-relaxed italic border-l-4 border-[#FF4757]/20 pl-4">{finalLevelData.content}</p>
                        </div>
                        <div className="card-bubbly !bg-[#F0FDF4] !border-[#DCFCE7] p-8">
                           <div className="flex items-center gap-3 mb-4 text-[#22C55E]">
                              <span className="material-symbols-rounded">palette</span>
                              <h4 className="font-black uppercase tracking-widest text-sm">Rekomendasi Visual</h4>
                           </div>
                           <p className="text-[#333333] font-medium leading-relaxed">{finalLevelData.visual}</p>
                        </div>
                        <div className="card-bubbly !bg-[#FFF7ED] !border-[#FFEDD5] p-8">
                           <div className="flex items-center gap-3 mb-4 text-[#FFB347]">
                              <span className="material-symbols-rounded">tips_and_updates</span>
                              <h4 className="font-black uppercase tracking-widest text-sm">Saran Peningkatan</h4>
                           </div>
                           <p className="text-[#333333] font-bold italic leading-relaxed">"{smartAdvice}"</p>
                        </div>
                     </div>
                  </div>

                  {recommendations.length > 0 && (
                    <div className="relative z-10">
                       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                          <h3 className="text-2xl font-black text-[#333333] flex items-center gap-3"><span className="material-symbols-rounded text-3xl text-[#FFB347]">auto_stories</span> Rekomendasi Bacaan Untukmu:</h3>
                          <Link href="/explore/library" className="px-5 py-2 rounded-xl bg-white border-2 border-[#E2E8F0] text-[#5AAFD1] font-black text-[10px] uppercase tracking-widest hover:bg-[#F0F8FF] transition-all self-start">Lihat Semua Koleksi</Link>
                       </div>
                       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                          {recommendations.map(book => (
                             <Link 
                              key={book.id} 
                              href={`/explore/read/${book.id}`} 
                              className="group flex flex-col relative overflow-hidden h-[280px] rounded-[28px] border-4 border-[#E2E8F0] shadow-sm transform transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_20px_rgba(0,0,0,0.1)] p-0 bg-white"
                             >
                                <div className="absolute top-3 left-3 z-10 pointer-events-none">
                                  <div 
                                    className={`w-9 h-9 flex items-center justify-center text-[10px] font-black shadow-lg border-2 border-white transform group-hover:scale-110 transition-transform ${
                                      book.level.includes('Dini') ? 'bg-[#FF4757] text-white' : 
                                      book.level.includes('Awal') ? 'bg-[#8E44AD] text-white rounded-full' : 
                                      book.level.includes('Semenjana') ? 'bg-[#1E3A8A] text-white rounded-full' : 
                                      book.level.includes('Madya') ? 'bg-[#22C55E] text-white' : 
                                      'bg-[#FACC15] text-[#333333] rounded-sm' 
                                    }`}
                                    style={{
                                      clipPath: book.level.includes('Dini') 
                                        ? 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)' 
                                        : book.level.includes('Madya')
                                        ? 'polygon(50% 0%, 0% 100%, 100% 100%)' 
                                        : 'none'
                                    }}
                                  >
                                    <span className={book.level.includes('Madya') ? 'mt-2' : ''}>
                                      {book.level.includes('Dini') ? 'A' : 
                                       book.level.includes('B-1') ? 'B1' : 
                                       book.level.includes('B-2') ? 'B2' : 
                                       book.level.includes('B-3') ? 'B3' : 
                                       book.level.includes('Awal') ? 'B' : 
                                       book.level.includes('Semenjana') ? 'C' : 
                                       book.level.includes('Madya') ? 'D' : 
                                       'E'}
                                    </span>
                                  </div>
                                </div>
  
                                <div className="absolute inset-0 bg-white">
                                  <Image src={book.cover} alt={book.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized />
                                </div>
  
                                <div className="absolute left-0 right-0 p-2 pb-3 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-20 -bottom-[50px] group-hover:bottom-0">
                                  <div className="bg-white/95 backdrop-blur-xl rounded-2xl p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] border-t-4 border-[#E2E8F0]">
                                    <h3 className="text-[12px] font-black text-[#333333] leading-tight mb-2 line-clamp-2">{book.title}</h3>
                                    <div className="flex items-center gap-2">
                                      <span className="border-2 border-[#6C3483] px-2 py-0.5 rounded-full text-[8px] font-black text-[#6C3483] shadow-sm flex items-center">
                                        <span className="text-[10px] mr-1">📚</span>{book.level}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10 pointer-events-none"></div>
                             </Link>
                          ))}
                       </div>
                    </div>
                  )}

                  <div className="mt-20 flex flex-col md:flex-row justify-center items-center gap-6">
                     <button 
                        onClick={() => window.location.reload()} 
                        className="w-full md:w-auto px-10 py-5 bg-white text-[#87CEEB] border-4 border-[#87CEEB] rounded-full font-black text-xl hover:bg-[#F0F8FF] transition-all flex items-center justify-center gap-3 shadow-[0_6px_0_#5AAFD1]"
                     >
                        DIAGNOSIS ULANG <span className="material-symbols-rounded text-2xl">refresh</span>
                     </button>
                     <Link href="/explore/library" className="w-full md:w-auto btn-bubbly px-12 py-5 text-xl flex items-center justify-center gap-3">
                        KEMBALI KE PERPUSTAKAAN <span className="material-symbols-rounded text-2xl font-bold">celebration</span>
                     </Link>
                  </div>
               </div>
            </div>
         )}
      </main>

      {step === "result" && (
         <CertificateTemplate 
           ref={certificateRef}
           profileName={profile.name}
           levelData={finalLevelData}
           fluencyData={finalFluency}
           compScore={compScore}
         />
       )}
    </div>
  );
}
