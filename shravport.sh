#!/bin/bash

now=$(printf "%(%F_%H%M%S)T")

./waveport ./react-postgres/src/App.js ./target/fe/App.js & ./waveport ./react-postgres/src/App.css ./target/fe/App.css & ./waveport ./react-postgres/src/app/store.js ./target/fe/app/store.js & ./waveport ./react-postgres/src/features/tableSlice.js ./target/fe/features/tableSlice.js & ./waveport ./node-postgres/merchant_model.js ./target/be/merchant_model.js & ./waveport ./node-postgres/index.js ./target/be/index.js

FILE=somefile.zip  
FILE=${FILE%.*}_`date +%d%b%y`.${FILE#*.}
echo $FILE   

zip -r $FILE target