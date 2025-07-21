#!/usr/bin/env sh

temp_dir=$(mktemp -d)

wget -P $temp_dir https://cdn.cs50.net/2022/fall/psets/7/movies.zip
unzip $temp_dir/movies.zip -d $temp_dir
mv $temp_dir/movies/movies.db data/movies.db

rm -rf $temp_dir
