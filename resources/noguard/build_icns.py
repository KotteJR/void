#!/usr/bin/env python3
"""Build a valid macOS .icns from square PNGs (no macOS tools required)."""
import struct
import sys
import os

# icns OSType -> source square png size
ENTRIES = [
    (b"ic07", 128),
    (b"ic08", 256),
    (b"ic09", 512),
    (b"ic10", 1024),
    (b"ic11", 32),
    (b"ic12", 64),
    (b"ic13", 256),
    (b"ic14", 512),
]


def build(src_dir: str, out_path: str) -> None:
    chunks = []
    for ostype, size in ENTRIES:
        png_path = os.path.join(src_dir, f"sq-{size}.png")
        with open(png_path, "rb") as f:
            data = f.read()
        length = len(data) + 8
        chunks.append(ostype + struct.pack(">I", length) + data)

    body = b"".join(chunks)
    total = len(body) + 8
    icns = b"icns" + struct.pack(">I", total) + body
    with open(out_path, "wb") as f:
        f.write(icns)
    print(f"wrote {out_path} ({total} bytes)")


if __name__ == "__main__":
    src = os.path.dirname(os.path.abspath(__file__))
    out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(src, "noguard.icns")
    build(src, out)
