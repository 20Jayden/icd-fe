<template>
	<div class="loader-wrap">
		<div class="loader">
			<div class="box box-1">
				<div class="side-left"></div>
				<div class="side-right"></div>
				<div class="side-top"></div>
			</div>
			<div class="box box-2">
				<div class="side-left"></div>
				<div class="side-right"></div>
				<div class="side-top"></div>
			</div>
			<div class="box box-3">
				<div class="side-left"></div>
				<div class="side-right"></div>
				<div class="side-top"></div>
			</div>
			<div class="box box-4">
				<div class="side-left"></div>
				<div class="side-right"></div>
				<div class="side-top"></div>
			</div>
		</div>
		<div class="ment">{{ title }}<br />{{ subTitle }}</div>
	</div>
</template>

<script>
export default {
	components: {},
	props: {
		title: {
			type: String,
			default: '시간이 다소 소요될 수 있습니다.',
		},
		subTitle: {
			type: String,
			default: '잠시만 기다려주세요.',
		},
	},
	setup() {
		return {}
	},
}
</script>

<style scoped>
/* 로딩중 */
.loader-wrap {
	width: 100%;
	height: 100%;
	background-color: rgba(0, 0, 0, 0.3);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	position: fixed;
	top: 0;
	left: 0;
	z-index: 80;
}
.loader-wrap .ment {
	margin-top: 50px;
	font-size: 1rem;
	color: #fff;
	text-align: center;
	line-height: 1.5;
}
.loader {
	width: 40px;
	height: 50px;
	scale: 3;
}
.loader .box {
	opacity: 0;
	position: relative;
	left: 10px;
}
.loader .side-left {
	width: 19px;
	height: 5px;
	background-color: #286cb5;
	position: absolute;
	top: 14px;
	left: 10px;
	transform: skew(0deg, -25deg);
}
.loader .side-right {
	width: 19px;
	height: 5px;
	background-color: #2f85e0;
	position: absolute;
	top: 14px;
	left: -9px;
	transform: skew(0deg, 25deg);
}
.loader .side-top {
	width: 20px;
	height: 20px;
	background-color: #5fa8f5;
	position: absolute;
	transform: skew(-20deg, -20deg);
	rotate: 45deg;
}
.loader .box-1 {
	animation: from-left 4s infinite;
}
.loader .box-2 {
	animation: from-right 4s infinite;
	animation-delay: 1s;
}
.loader .box-3 {
	animation: from-left 4s infinite;
	animation-delay: 2s;
}
.loader .box-4 {
	animation: from-right 4s infinite;
	animation-delay: 3s;
}
@keyframes from-left {
	0% {
		z-index: 20;
		opacity: 0;
		translate: -20px -6px;
	}
	20% {
		z-index: 10;
		opacity: 1;
		translate: 0px 0px;
	}
	40% {
		z-index: 9;
		translate: 0px 4px;
	}
	60% {
		z-index: 8;
		translate: 0px 8px;
	}
	80% {
		z-index: 7;
		opacity: 1;
		translate: 0px 12px;
	}
	100% {
		z-index: 5;
		translate: 0px 30px;
		opacity: 0;
	}
}
@keyframes from-right {
	0% {
		z-index: 20;
		opacity: 0;
		translate: 20px -6px;
	}
	20% {
		z-index: 10;
		opacity: 1;
		translate: 0px 0px;
	}
	40% {
		z-index: 9;
		translate: 0px 4px;
	}
	60% {
		z-index: 8;
		translate: 0px 8px;
	}
	80% {
		z-index: 7;
		opacity: 1;
		translate: 0px 12px;
	}
	100% {
		z-index: 5;
		translate: 0px 30px;
		opacity: 0;
	}
}
</style>
