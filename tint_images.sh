#!/bin/bash
declare -A colors
colors["calm_illustration.png"]="#00A896"
colors["stress_relief_illustration.png"]="#705DFA"
colors["focus_illustration.png"]="#FF9F1C"
colors["sleep_illustration.png"]="#2B2D42"
colors["mindfulness_illustration.png"]="#FF5A5F"
colors["relaxation_illustration.png"]="#8E44AD"
colors["breathing_illustration.png"]="#2EC4B6"
colors["new_yoga_illustration.png"]="#E74C3C"
colors["spiritual_illustration.png"]="#34495E"
colors["peaceful_illustration.png"]="#45B39D"
colors["soft_illustration.png"]="#D291BC"
colors["yoga_illustration.png"]="#81B29A"

for img in "${!colors[@]}"; do
  if [ -f "assets/images/$img" ]; then
    echo "Processing $img with color ${colors[$img]}"
    magick "assets/images/$img" -colorspace gray +level-colors "${colors[$img]}",white "assets/images/$img"
  fi
done
