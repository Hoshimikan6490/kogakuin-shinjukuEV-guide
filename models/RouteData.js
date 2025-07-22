const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
	{
		EV: {
			type: String,
			required: true,
		},
		stairs: {
			type: String,
			required: true,
		},
		orderOfPriority: {
			type: String,
			required: true,
		},
	},
	{ _id: false }
);

const routeDataSchema = new mongoose.Schema(
	{
		building: {
			type: String,
			required: true,
		},
		floor: {
			type: String,
			required: true,
		},
		room: {
			type: String,
			required: true,
		},
		routes: {
			type: Map,
			of: routeSchema,
			default: {},
		},
	},
	{
		timestamps: true,
	}
);

// 複合インデックスで建物、階、部屋の組み合わせを一意にする
routeDataSchema.index({ building: 1, floor: 1, room: 1 }, { unique: true });

module.exports = mongoose.model("RouteData", routeDataSchema);
