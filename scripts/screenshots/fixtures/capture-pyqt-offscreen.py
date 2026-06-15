#!/usr/bin/env python3
"""Capture Media Downloader UI via Qt offscreen platform."""
import os
import sys

os.environ.setdefault("QT_QPA_PLATFORM", "offscreen")

from PyQt5.QtWidgets import QApplication

repo = sys.argv[1]
out = sys.argv[2]
sys.path.insert(0, repo)

from media_downloader import DownloaderUI  # noqa: E402

app = QApplication(sys.argv)
window = DownloaderUI()
window.resize(900, 620)
window.show()
app.processEvents()
pixmap = window.grab()
pixmap.save(out, "PNG")
print(f"Saved {out}")
