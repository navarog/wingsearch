find ../src/assets/ -type f -iname \*.jpg | while read -r file
do
    cwebp "$file" -o "${file%.*}.webp"
done

find ../src/assets/ -type f -iname \*.png | while read -r file
do
    cwebp "$file" -o "${file%.*}.webp"
done

# Argument to blend with card background: -blend_alpha f5f6f1
