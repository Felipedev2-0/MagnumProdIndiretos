/*global QUnit*/

sap.ui.define([
	"comdevmagnum/indiretos/controller/ProdutosIndiretos.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ProdutosIndiretos Controller");

	QUnit.test("I should test the ProdutosIndiretos controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
