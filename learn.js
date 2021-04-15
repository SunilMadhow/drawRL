var  num_episodes = 0;
var w;
var epsilon = 0;
var alpha = .32/tilings.length 

function getVectorLength() {
	return queryPoint(0, 0, 0).length;
}

function initParameter() {
	let p = getVectorLength();
	let w = []
	console.log(p);
	for (let i = 0; i < p; i ++) {
		w[i] = 0;
		console.log(w[i]);
	}
	console.log(w.length);
	console.log(w);
	return w;
}

function Q(observation) {
	let q_list = [0, 0, 0];
	for (let i = 0; i < 3; i ++) {
		q_list[i] = dot(queryPoint(observation[0], observation[1]), w);
	}
	return q_list;
}

function learn() {
	var reward = 0;
	var fifty_ep_sum = 0 ;
	var discount = 1;
	var observation = observe();
	var G = 0;
	var prediction = Math.max(Q(observation));
	var action = 0;
	var prime = 0;
	var steps = 0;
	w = initParameter();

	var episodes = 0;
	setInterval(function() { 
		reward = update(action);
		G += reward;
		if (reward == 0) {
			episodes ++;
			fifty_ep_sum += G;
			if (episodes % 50 == 0) {

				fifty_ep_sum = 0;
				console.log("Average score over 50 episodes at "  + episodes  +" = " + fifty_ep_sum/50.0);
			}
			G = 0;
			reset();
			observation = observe();
			if (episodes > 3000) return;
			reward = update(action);
			G += reward;
		}
		observation = observe();
		let canvpoint = coordSwitch(observation[0], observation[1]);
		// if (steps % 150 == 0) {
		// 	plot_point(canvpoint[0], canvpoint[1]);
		// }
		normed = normalize(observation);
		if(Math.random() > epsilon) {
			q_list = Q(observation);
			prime = Math.max(q_list);
			action = remap_action(argmax(q_list));
		}
		else {
			action = Math.floor(Math.random() * num_actions);
		}
		delta = reward + discount*prime - prediction;
		x_s = queryPoint(normed, action);
		w = vectorSum(w, scalarMult(alpha, scalarMult(delta, x_s)));
		prediction = prime;
		steps ++;
	 }, 5);

}

