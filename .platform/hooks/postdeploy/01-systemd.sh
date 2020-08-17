#!/bin/bash

if [ ! -d ./.platform/systemd ]; then
  exit 0
fi

for file in ./.platform/systemd/*; do
  filename=$(basename "$file")
  cp "$file" /etc/systemd/system
  chmod 644 "/etc/systemd/system/$filename"
  systemctl daemon-reload
  systemctl enable "$filename"
  if [[ "$filename" == *.timer ]]; then
    systemctl start "$filename"
  fi
done
