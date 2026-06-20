const videoData = [
  // AMV 2026
  {
    id: 'amv2026-1',
    title: "Giorno (Magic Johnson - Ian)",
    category: "AMV 2026",
    path: "https://res.cloudinary.com/dcp3oidmi/video/upload/q_auto/giorno_magic_jhonson_-_ian_dfdrr7.mp4",
  },

  // AMV 2025
  {
    id: 'amv2025-1',
    title: "ICHIGO",
    category: "AMV 2025",
    path: "https://res.cloudinary.com/dcp3oidmi/video/upload/q_auto/ICHIGO_pput5v.mp4",
  },
  {
    id: 'amv2025-2',
    title: "Kaneki",
    category: "AMV 2025",
    path: "https://res.cloudinary.com/dcp3oidmi/video/upload/q_auto/Kaneki_snhldl.mp4",
  },
  {
    id: 'amv2025-3',
    title: "Rukia Edit (Insane Lucille)",
    category: "AMV 2025",
    path: "https://res.cloudinary.com/dcp3oidmi/video/upload/q_auto/Rukia_Edit_Insane_Lucille_rvgjut.mp4",
  },

  // AMV PRE-2025
  {
    id: 'pre-1',
    title: "Asta",
    category: "AMV Pre-2025",
    path: "https://res.cloudinary.com/dcp3oidmi/video/upload/q_auto/Asta_fj47jt.mp4",
  },
  {
    id: 'pre-2',
    title: "MISA MISA MISA MISA",
    category: "AMV Pre-2025",
    path: "https://res.cloudinary.com/dcp3oidmi/video/upload/q_auto/MISA_MISA_MISA_MISA_ary9nn.mp4",
  },
  {
    id: 'pre-3',
    title: "Wont You Come My Way Gojo",
    category: "AMV Pre-2025",
    path: "https://res.cloudinary.com/dcp3oidmi/video/upload/q_auto/Wont_you_come_my_way_Gojo_omumgd.mp4",
  }
];

// Helper to extract categories for the filter menu
const categories = ["All", ...new Set(videoData.map(v => v.category))];
let currentFilter = "All"; // Declared globally for filter tracking
