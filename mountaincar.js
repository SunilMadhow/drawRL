position = -.5; //(-1.2, .6)
velocity = 0; //(-.7, .7)
var num_actions = 3;

function reset() {
	return [position, velocity]
}

function update(action) { //action \in [-1, 0, 1] accelerate left, idle, accelerate right
	velocity += action*.001+Math.cos(3*position)*(-0.025) ;
	clip(velocity, -.7, .7);
	position = position + velocity;
	if (position >= .6) return 0;
	else { return -1; }
}

function clip(val, min, max) {
	if (val < min) return min;
	if (val > max) return max;
	return val;
}