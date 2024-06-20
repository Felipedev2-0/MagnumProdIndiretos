sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"
],
    function (Controller, MessageBox) {
        "use strict";

        return Controller.extend("com.devmagnum.indiretos.controller.ProdutosIndiretos", {
            onInit: function () {
                // Aqui você pode inicializar o modelo ou fazer outras configurações necessárias
            },

            onPressGravar: function () {
                if (this._validateForm()) {
                    MessageBox.confirm(
                        "Deseja salvar o formulário preenchido?",
                        {
                            title: "Confirmação",
                            onClose: function (oAction) {
                                if (oAction === MessageBox.Action.OK) {
                                    // Adicione aqui a lógica para salvar os dados
                                    console.log("Dados salvos!");
                                }
                            }
                        }
                    );
                } else {
                    MessageBox.error("Por favor, preencha os campos obrigatórios.");
                }
            },

            onPressCancelar: function () {
                MessageBox.confirm(
                    "Deseja cancelar?",
                    {
                        title: "Confirmação",
                        onClose: function (oAction) {
                            if (oAction === MessageBox.Action.OK) {
                                this.limparFormulario(); // função para limpar o formulário
                                console.log("Operação cancelada!");
                            }
                        }.bind(this)
                    }
                );
            },

            limparFormulario: function () {
                // Limpar todos os campos do formulário
                var oView = this.getView();
                var aControls = oView.findAggregatedObjects(true);

                aControls.forEach(function (oControl) {
                    // Limpar Input, ComboBox, TextArea, MultiComboBox
                    if (oControl instanceof sap.m.Input ||
                        oControl instanceof sap.m.ComboBox ||
                        oControl instanceof sap.m.TextArea ||
                        oControl instanceof sap.m.MultiComboBox) {

                        if (oControl.setValue) {
                            oControl.setValue("");
                        }
                        if (oControl.setSelectedKey) {
                            oControl.setSelectedKey("");
                        }
                        if (oControl.setSelectedItems) {
                            oControl.setSelectedItems([]);
                        }
                        oControl.setValueState(sap.ui.core.ValueState.None);
                    }
                });
            },

            _validateForm: function () {
                var oView = this.getView();
                var bValid = true;

                // Verifica MultiComboBox
                var oMultiComboBox = oView.byId("combomarcas");
                if (!oMultiComboBox.getSelectedItems().length) {
                    bValid = false;
                    oMultiComboBox.setValueState("Error");
                } else {
                    oMultiComboBox.setValueState("None");
                }

                // Verifica TextAreas
                var aTextAreas = ["ObjetivoCadastrar", "DescricaoDetalProduto"];
                aTextAreas.forEach(function (sId) {
                    var oTextArea = oView.byId(sId);
                    if (!oTextArea.getValue()) {
                        bValid = false;
                        oTextArea.setValueState("Error");
                    } else {
                        oTextArea.setValueState("None");
                    }
                });

                // Verifica ComboBoxes
                var aComboBoxes = ["unidademedidaindireto"];
                aComboBoxes.forEach(function (sId) {
                    var oComboBox = oView.byId(sId);
                    if (!oComboBox.getSelectedKey()) {
                        bValid = false;
                        oComboBox.setValueState("Error");
                    } else {
                        oComboBox.setValueState("None");
                    }
                });

                return bValid;
            },

            onMarcasSelectionChange: function (oEvent) {
                var oMultiComboBox = oEvent.getSource();
                var aSelectedItems = oMultiComboBox.getSelectedItems();

                var bShowNCMAtivo = false;
                var bShowLCObsoleto = false;
                var bShowNCMObsoleto = false;
                var bShowLCAtivo = false;

                // Verifica as seleções no MultiComboBox
                aSelectedItems.forEach(function (oItem) {
                    var sKey = oItem.getKey();
                    if (sKey === "NLAG" || sKey === "HIBE") {
                        bShowNCMAtivo = true;
                        bShowLCObsoleto = true;
                    } else if (sKey === "SERV") {
                        bShowNCMObsoleto = true;
                        bShowLCAtivo = true;
                    }
                });

                // Atualiza o ComboBox NCM
                var oComboBoxNCM = this.getView().byId("ncm");
                if (bShowNCMAtivo) {
                    oComboBoxNCM.getBinding("items").filter([
                        new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "ATIVO")
                    ]);
                    oComboBoxNCM.setPlaceholder("Ativo");
                } else if (bShowNCMObsoleto) {
                    oComboBoxNCM.getBinding("items").filter([
                        new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "OBSOLETO")
                    ]);
                    oComboBoxNCM.setPlaceholder("Obsoleto");
                } else {
                    oComboBoxNCM.getBinding("items").filter([]);
                    oComboBoxNCM.setPlaceholder("");
                }

                // Atualiza o ComboBox LC
                var oComboBoxLC = this.getView().byId("lc");
                if (bShowLCObsoleto) {
                    oComboBoxLC.getBinding("items").filter([
                        new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "OBSOLETO")
                    ]);
                    oComboBoxLC.setPlaceholder("Obsoleto");
                } else if (bShowLCAtivo) {
                    oComboBoxLC.getBinding("items").filter([
                        new sap.ui.model.Filter("Status", sap.ui.model.FilterOperator.EQ, "ATIVO")
                    ]);
                    oComboBoxLC.setPlaceholder("Ativo");
                } else {
                    oComboBoxLC.getBinding("items").filter([]);
                    oComboBoxLC.setPlaceholder("");
                }
            }
        });
    });
