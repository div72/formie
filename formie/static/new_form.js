let fields_div = document.getElementById('fields');

var index = 0;

function new_field() { 
	fields_div.insertAdjacentHTML('beforeend', `
<div id="field${index}">
	<input method="text" id="name" placeholder="Question"/>
	<select onchange="change_field(this.parentElement, this.value)">
		<option value="text">Text</option>
		<option value="single_choice">Single Choice</option>
		<option value="multi_choice">Multi Choice</option>
	</select>
	<div id="extra"></div>
	<button onclick="this.parentElement.remove()">Remove field</button>
</div>`);
	change_field(fields_div.lastChild, "text");
	index++;
}

function change_field(field, typ) {
	let extra = field.children[field.children.length - 2];

	if (typ === "text") {
		extra.innerHTML = '<input method="text" id="default" placeholder="Default" />'; 
	} else if (typ === "single_choice") {
		extra.innerHTML = '<button onclick="add_choice(this.parentElement, true)">Add choice</button>';
	} else if (typ === "multi_choice") {
		extra.innerHTML = '<button onclick="add_choice(this.parentElement, false)">Add choice</button>';
	}
}

function add_choice(element, is_radio) {
	var typ = 'checkbox';
	if (is_radio) typ = 'radio';
	element.insertAdjacentHTML('beforeend', `
<input type="${typ}"><input type="text"/></input>
`)
}

function make_schema() {
	let schema = [];
	for (field of fields_div.children) {
		let schema_field = {};
		schema_field.name = field.children[0].value;
		if (field.children[1].selectedIndex === 0) {
			schema_field.type = "text";
			schema_field.default = field.children[2].lastChild.value;
		} else {
			schema_field.choices = [];
			schema_field.unique = false;
			schema_field.type = "choice";
			if (field.children[1].selectedIndex === 1) schema_field.unique = true;
			for (choice in field.children[2].children) {
				schema_field.choices.push(choice.lastChild.value);
			}
		}
		schema.push(schema_field);
	}
	return schema;
}

function submit_form() {
	let req = new XMLHttpRequest();
	req.open('POST', document.location.href);	
	req.setRequestHeader('Content-Type', 'application/json');
	req.send(JSON.stringify(make_schema()));
}