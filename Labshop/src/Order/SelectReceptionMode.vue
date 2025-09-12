<template>
<div class="ctn">
    <div class="expedition" :class="{ expeditionSelected: expeditionSelected() }" @click="changeReceptionType(ZERO)">
        <div class="group">
            <div class="circle" :class="{circleFilled: expeditionSelected()}"></div>
            <p>Expédition</p>
        </div>
        <!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="icon" :class="{ iconFilled: expeditionSelected() }">
            <path d="M64 160C64 124.7 92.7 96 128 96L416 96C451.3 96 480 124.7 480 160L480 192L530.7 192C547.7 192 564 198.7 576 210.7L621.3 256C633.3 268 640 284.3 640 301.3L640 448C640 483.3 611.3 512 576 512L572.7 512C562.3 548.9 528.3 576 488 576C447.7 576 413.8 548.9 403.3 512L300.7 512C290.3 548.9 256.3 576 216 576C175.7 576 141.8 548.9 131.3 512L128 512C92.7 512 64 483.3 64 448L64 400L24 400C10.7 400 0 389.3 0 376C0 362.7 10.7 352 24 352L136 352C149.3 352 160 341.3 160 328C160 314.7 149.3 304 136 304L24 304C10.7 304 0 293.3 0 280C0 266.7 10.7 256 24 256L200 256C213.3 256 224 245.3 224 232C224 218.7 213.3 208 200 208L24 208C10.7 208 0 197.3 0 184C0 170.7 10.7 160 24 160L64 160zM576 352L576 301.3L530.7 256L480 256L480 352L576 352zM256 488C256 465.9 238.1 448 216 448C193.9 448 176 465.9 176 488C176 510.1 193.9 528 216 528C238.1 528 256 510.1 256 488zM488 528C510.1 528 528 510.1 528 488C528 465.9 510.1 448 488 448C465.9 448 448 465.9 448 488C448 510.1 465.9 528 488 528z"/>
        </svg>
    </div>
    <div class="pickUp" :class="{ pickUpSelected: pickUpSelected() }" @click="changeReceptionType(ONE)">
        <div class="group">
            <div class="circle" :class="{circleFilled: pickUpSelected()}"></div>
            <p>Cueillette</p>
        </div>
        <!--!Font Awesome Free v7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.-->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" class="icon" :class="{ iconFilled: pickUpSelected() }">
            <path d="M53.5 245.1L110.3 131.4C121.2 109.7 143.3 96 167.6 96L472.5 96C496.7 96 518.9 109.7 529.7 131.4L586.5 245.1C590.1 252.3 592 260.2 592 268.3C592 295.6 570.8 318 544 319.9L544 512C544 529.7 529.7 544 512 544C494.3 544 480 529.7 480 512L480 320L384 320L384 496C384 522.5 362.5 544 336 544L144 544C117.5 544 96 522.5 96 496L96 319.9C69.2 318 48 295.6 48 268.3C48 260.3 49.9 252.3 53.5 245.1zM160 320L160 432C160 440.8 167.2 448 176 448L304 448C312.8 448 320 440.8 320 432L320 320L160 320z"/>
        </svg>
    </div>
</div>
</template>

<script setup>
const ZERO = 0;
const ONE = 1;
const receptionType = defineModel({default: 0}); // 0 -> Expédition 1 -> Pickup

const emit = defineEmits(['receptionTypeChanged'])
function expeditionSelected () { return receptionType.value === ZERO;}
function pickUpSelected () { return receptionType.value === ONE; } 

function changeReceptionType(value) {
    receptionType.value = value;
    emit('receptionTypeChanged', value);
}
</script>

<style scoped>
* {
    padding: 0%;
    margin: 0%;
    box-sizing: border-box;
}
.ctn {
    width: 100%;
    display: flex;
    flex-direction: column;
}
.ctn .expedition, 
.ctn .pickUp {
    display: flex;
    padding: 14px;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    border: 1px solid #ddd;
    transition: border-color 0.3s ease;
    font-size: 0.85em;
}
.ctn .expedition {
    border-radius: 6px 6px 0 0;
    border-bottom: none;
}
.ctn .pickUp {
    border-radius: 0 0 6px 6px;
    border-top: none;
}
.group {
    display: flex;
    align-items: center;
}
.circle {
    width: 16px;
    height: 16px;
    margin-right: 8px;
    border: 1px solid #333;
    background-color: transparent;
    border-radius: 50%;
    transition: border-width 0.2s ease, border-color 0.2s ease;
}
.expeditionSelected {
    border: 1px solid #333 !important;
}
.pickUpSelected {
    border: 1px solid #333 !important;
}
.circleFilled {
    border: 6px solid #333;
}
.icon {
    color: #bbb;
    width: 18px;
    height: 18px;
    transition: color 0.3s ease;
}
.iconFilled {
    color: #333;
}
</style>