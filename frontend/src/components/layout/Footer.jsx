export default function Footer() {
  return (
    <footer className="bg-black text-text-secondary border-t border-white/5">
      <div className="max-w-page mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
        <div className="flex items-center gap-2 text-white font-bold">
          <span aria-hidden>🎙️</span> PodPlanner
        </div>
        <p>© {new Date().getFullYear()} PodPlanner. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">Support</a>
        </div>
      </div>
    </footer>
  );
}
