import React from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';
import CKEditor from "react-ckeditor-component";
import SignaturePad from "./index";
import Dropzone from 'react-dropzone';
import request from 'superagent';
import './imageupload.css';
import FileBase64 from 'react-file-base64';
import Dialog from 'material-ui/Dialog';
const CLOUDINARY_UPLOAD_PRESET = 'bmzjbxoq';
const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/react-cloudinary/upload';
import * as TemplateAction from '../../actions/templateAction.jsx';
import TemplateStore from '../../store/templateStore.jsx';
import * as ClientAction from '../../actions/clientAction.jsx';
import ClientStore from '../../store/clientStore.jsx';
import * as ContractAction from '../../actions/contractAction.jsx';
import ContractStore from '../../store/contractStore.jsx';
import * as UserAction from '../../actions/userAction.jsx';
import UserStore from '../../store/userStore.jsx';
import * as _ from 'lodash';
import FontAwesome from 'react-fontawesome';
import  numberToWords from 'number-to-words';
import {FormField} from "../commonComponents/FormFieldComponent";

class ContractDetails extends React.Component {
    textBoxIds= ['Subscription Amount', 'Agent Name', 'Agent NRIC/Passport Number', 
    'No of Preference Shares', 'Monthly Profit pay by Company', 'Contract Value',
    'Contract Start Date','Created Date', 'Contract End Date', 'First Pay out Date', 'Last Pay out Date', 'Witness-1 Name', 'Witness-2 Name', 'Subscription Amount Payback Date', 'Client Name', 'Organization Name', 'Client NRIC number','Client address','Client email','Client attn','Monthly Subscription amount Payback','Total Profit percentage','Profit amount','Monthly profit percentage','Additional profit percentage','Extension amount','Additional profit Amount','Company email','Company attn','Witness 1 NRIC number','Witness 2 NRIC number', 'Agent Signature', 'Client Signature', 'Witness-1 Signature', 'Witness-2 Signature', 'Contract Id', 'Agent Id', 'Client Id', 'Template Id', 'Contract Months'];
    currentActiveTextBox;
    activeEditor;
    constructor(props) {
        super(props);
        var today = new Date(),
            date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let name = localStorage.getItem('username');
        this.state = {
            today: today,
            date: date,
            id:'',
            contractId: '',
            AgentId: '',
            contractMonths: '',
            title:'',
            name:'',
            clientName:'',
            clientId:'',
            templateName:'',
            templateId:'',
            orgId:'',
            html:'',
            formFields: [],
            contracttitle: '',
            contractname: '',
            contractstartDate: '',
            contractendDate: '',
            firstpayoutDate: '',
            lastpayoutDate: '',
            subscriptionamountpayDate: '',
            agentname: '',
            subscriptionamount: '',
            passportnumber: '',
            sharescount: '',
            monthlyprofitpay: '',
            ClientShareHolderName: '',
            ClientNRICNumber: '',
            ClientAddress: '',
            ClientEmail: '',
            ClientAttn: '',
            Quarterpercentage: '',
            TotalProfitPercentage: '',
            Profitamount: '',
            MonthlyProfitPercentage: '',
            AdditionalProfitPercentage: '',
            ExtensionAmount: '',
            AdditionalProfitAmount: '',
            Companyemail: 'enquiries@cradwealth.co',
            Companyattn: '',
            FirstWitnessNRICnumber: '',
            SecondWitnessNRICnumber: '',
            Witness1Name: '',
            Witness2Name: '',
            currency: '',
            clientname: '-1',
            templatename: '-1',
            orgname: '-1',
            uploadedFile: null,
            picture: '',
            content: "",
            openSignatureDialog: false,
            signDialogOpenedFor: '',
            organizationlist: {
                organizations: []
            },
            templatelist: {
                templates: []
            },
            clientdetails: {
                clients: []
            },
            singletemplate: {
                template: {},
            },
            singleclientdetails:{
              client: {},
            },
            userroleslist:{
                user: {
                role: {
                    permission: [],
                },
            }
            },
            editorContent: '',
            files: [],
            operation:'',



        };
        this.getFiles = this.getFiles.bind(this);
        this.handleContractTitleChange = this.handleContractTitleChange.bind(this);
        this.handleContractIdChange = this.handleContractIdChange.bind(this);
        this.handleAgentIdChange = this.handleAgentIdChange.bind(this);
        this.handleClientIdChange = this.handleClientIdChange.bind(this);
        this.handleTemplateIdChange = this.handleTemplateIdChange.bind(this);
        this.handleContractMonthsChange = this.handleContractMonthsChange.bind(this);
        this.handleWitness1NameChange = this.handleWitness1NameChange.bind(this);
        this.handleWitness2NameChange = this.handleWitness2NameChange.bind(this);
        this.handleContractNameChange = this.handleContractNameChange.bind(this);
        this.handleContractStartDateChange = this.handleContractStartDateChange.bind(this);
        this.handleContractEndDateChange = this.handleContractEndDateChange.bind(this);
        this.handleFirstPayoutDateChange = this.handleFirstPayoutDateChange.bind(this);
        this.handleLastPayoutDateChange = this.handleLastPayoutDateChange.bind(this);
        this.handleSubscriptionamountPayDateChange = this.handleSubscriptionamountPayDateChange.bind(this);
        this.handleAgentNameChange = this.handleAgentNameChange.bind(this);
        this.handleSubscrtiptionAmountChange = this.handleSubscrtiptionAmountChange.bind(this);
        this.handlePassportNumberChange = this.handlePassportNumberChange.bind(this);
        this.handleSharesCountChange = this.handleSharesCountChange.bind(this);
        this.handleMonthlyProfitPayChange = this.handleMonthlyProfitPayChange.bind(this);
        this.handleClientShareHolderNameChange = this.handleClientShareHolderNameChange.bind(this);
        this.handleClientNRICNumberChange = this.handleClientNRICNumberChange.bind(this);
        this.handleClientAddressChange = this.handleClientAddressChange.bind(this);
        this.handleClientEmailChange = this.handleClientEmailChange.bind(this);
        this.handleClientAttnChange = this.handleClientAttnChange.bind(this);
        this.handleQuarterPercentageChange = this.handleQuarterPercentageChange.bind(this);
        this.handleTotalProfitPercentageChange  = this.handleTotalProfitPercentageChange.bind(this);
        this.handleProfitamountChange = this.handleProfitamountChange.bind(this);
        this.handleMonthlyProfitPercentageChange = this.handleMonthlyProfitPercentageChange.bind(this);
        this.handleAdditionalProfitPercentageChange = this.handleAdditionalProfitPercentageChange.bind(this);
        this.handleExtensionAmountChange = this.handleExtensionAmountChange.bind(this);
        this.handleAdditionalProfitAmountChange = this.handleAdditionalProfitAmountChange.bind(this);
        this.handleCompanyemailChange = this.handleCompanyemailChange.bind(this);
        this.handleCompanyattnChange = this.handleCompanyattnChange.bind(this);
        this.handleFirstWitnessNRICnumberChange = this.handleFirstWitnessNRICnumberChange.bind(this);
        this.handleSecondWitnessNRICnumberChange = this.handleSecondWitnessNRICnumberChange.bind(this);
        
        this.handleContractValueChange = this.handleContractValueChange.bind(this);
        this.handleClientNameChange = this.handleClientNameChange.bind(this);
        this.handleTemplateNameChange = this.handleTemplateNameChange.bind(this);
        this._createContractDetails = this._createContractDetails.bind(this);
        this.handleorgnameChange = this.handleorgnameChange.bind(this);
        this.getElemForPDF = this.getElemForPDF.bind(this);
        this._openSignatureDialog = this._openSignatureDialog.bind(this);
        this.replaceText = this.replaceText.bind(this);
        this.ckeditorInstanceReady = this.ckeditorInstanceReady.bind(this);
        this.updateEditorData = this.updateEditorData.bind(this);
        this._templateStoreChange = this._templateStoreChange.bind(this);
        this._contractStoreChange = this._contractStoreChange.bind(this);
        this._clientStoreChange = this._clientStoreChange.bind(this);
        this._userStoreChange = this._userStoreChange.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.handleEditorChange = this.handleEditorChange.bind();
        this.onChange = this.onChange.bind(this);
        this.logSig = this.logSig.bind(this);
        this.handleFieldValueChange = this.handleFieldValueChange.bind(this);
    }

    componentWillMount() {
        TemplateStore.on('change', this._templateStoreChange);
        ContractStore.on('change', this._contractStoreChange);
        ClientStore.on('change', this._clientStoreChange);
         UserStore.on('change', this._userStoreChange);
        

    }

    componentWillUnmount() {
        TemplateStore.removeListener('change', this._templateStoreChange);
        ContractStore.removeListener('change', this._contractStoreChange);
        ClientStore.removeListener('change', this._clientStoreChange);
        UserStore.removeListener('change', this._userStoreChange);
    }

    componentDidMount() {
        var op = localStorage.getItem('operation');
        var data1 = localStorage.getItem('edit_data');
        console.log('data@@',JSON.parse(data1))
        if(op == 'edit'){
            var data = JSON.parse(data1)
            this.setState(JSON.parse(data1));
            let singleclientdetails = {
                client : {
                    id : data.fieldsValue[15].fieldValue,
                    name : data.fieldsValue[16].fieldValue,
                    icno : data.fieldsValue[17].fieldValue,
                    address : data.fieldsValue[18].fieldValue,
                    email : data.fieldsValue[19].fieldValue,
                    attention : data.fieldsValue[20].fieldValue,
                }
            }
             
             let singletemplate = {
                template: {
                    id: data.fieldsValue[30].fieldValue,
                }
             }
            this.setState({singleclientdetails, singletemplate});
            this.setState({
                      
                
                currency : data.fieldsValue[0].fieldValue,
                contractMonths : data.fieldsValue[1].fieldValue,
                contractstartDate: data.fieldsValue[2].fieldValue,
                contractendDate: data.fieldsValue[3].fieldValue,
                subscriptionamount : data.fieldsValue[4].fieldValue,
                Quarterpercentage : data.fieldsValue[5].fieldValue,
                MonthlyProfitPercentage : data.fieldsValue[6].fieldValue,
                monthlyprofitpay : data.fieldsValue[7].fieldValue,
                TotalProfitPercentage : data.fieldsValue[8].fieldValue,
                Profitamount : data.fieldsValue[9].fieldValue,
                firstpayoutDate : data.fieldsValue[10].fieldValue,
                lastpayoutDate : data.fieldsValue[11].fieldValue,
                AdditionalProfitPercentage : data.fieldsValue[12].fieldValue,
                subscriptionamountpayDate : data.fieldsValue[13].fieldValue,
                passportnumber : data.fieldsValue[14].fieldValue,
                sharescount : data.fieldsValue[21].fieldValue,
                ExtensionAmount : data.fieldsValue[22].fieldValue,
                AdditionalProfitAmount : data.fieldsValue[23].fieldValue,
                Companyemail : data.fieldsValue[24].fieldValue,
                Companyattn : data.fieldsValue[25].fieldValue,
                FirstWitnessNRICnumber : data.fieldsValue[26].fieldValue,
                SecondWitnessNRICnumber : data.fieldsValue[27].fieldValue,
                Witness1Name : data.fieldsValue[28].fieldValue,
                Witness2Name : data.fieldsValue[29].fieldValue,
            })
        }
        TemplateAction._getOrganizationList();
        TemplateAction._getTemplateList();
        ClientAction._getClientList();
        TemplateAction._getFormList();
        UserAction._getUserRolesList();
    }

    handleFieldValueChange(event, fieldName, dateFlag, e){
        
      let state = this.state;
      let name;
      let value;
      if(dateFlag){
        name = fieldName;
        value = event;
      }
      if(!dateFlag) {
        name = event.target.id;
        value = event.target.value;
      }
      state[name] = value;
        this.setState({
          [name]: value
        });

        if (name === "templatename" && value && this.state.formsList.forms.length > 0) {
          let formFields= {};
          formFields = this.state.formsList.forms.filter((t) => {
            return state.templatelist.templates[event.target.selectedIndex-1].formId === t.id
          });
          this.setState({
            [name] : value,
            formFields: formFields[0].fields
          });
        }
        this.setState({ templatename: value });
        console.log("templateId",value);
        let data = {
            id: value,
        };

        TemplateAction._getSingleTemplate(data);
    }

    _templateStoreChange(type) {
        if (type == 'OrganizationList') {
            let organizationlist = TemplateStore._getOrganizionDetailsList() || {};
            this.setState({ organizationlist });
        }
        if (type == 'TemplateList') {
            let templatelist = TemplateStore._getTemplateDetailsList() || {};
            this.setState({ templatelist });
        }

        if (type == 'SingleTemplate') {
            let singletemplate = TemplateStore._getSingleTemplate() || {};
            this.setState({ editorContent: singletemplate.template.html, singletemplate });
        }
        if(type == "FormList") {
          let formList = TemplateStore._getFormDetailsList() || {};
          this.setState({formsList : formList});
        }
    }

    _clientStoreChange(type) {
        if (type == 'ClientList') {
            let clientdetails = ClientStore._getClientDeatilsList() || {};
            this.setState({ clientdetails });
        }
        if(type == 'SingleClient'){
        let singleclientdetails = ClientStore._getSingleClientDetails() || {};
        console.log("singleclientdetails", singleclientdetails);
        this.setState({singleclientdetails});
    }
    }

    _contractStoreChange(type) {
        if (type == 'ContractList') {
            let contractlist = ContractStore._getContractDetailsList() || {};
            this.setState({ contractlist });
        }
    }

    _userStoreChange(type){
        if(type == 'UserList'){
        let userdetails = UserStore._getUserDetailsList() || {};
        this.setState({userdetails});
    }
    if(type == 'RolesList'){
        let roleslist = UserStore._getRolesList() || {};
        this.setState({roleslist});
    }

    if(type == 'UserRolesList'){
        let userroleslist = UserStore._getUserRolesList() || {};
        
        this.setState({userroleslist});
    }
 }

    ckeditorInstanceReady(e) {
        this.activeEditor = e.editor;
    }

    updateEditorData() {

        this.state.content = _.cloneDeep(this.state.editorContent);
        this.textBoxIds.forEach((id) => {
            let element = document.getElementById(id);
            if (element != undefined) {
                if (element.value != undefined && element.value != '') {
                    this.replaceText(id, element.value);
                }
            }
        })
        this.activeEditor.setData(this.state.content);
    }

    replaceText(textboxId, value) {
        var templatesToReplace = [];
        const myRegexExp = /\$\$(.*?)\$\$+/g;
        let findResults = myRegexExp.exec(this.state.content);
        while (findResults != null) {
            templatesToReplace.push(findResults);
            findResults = myRegexExp.exec(this.state.content);
        }
        templatesToReplace.forEach(line => {
            if (line[1] == textboxId) {
                this.state.content = this.state.content.replace(line[0], value);
            }
        })
    }




    handleContractTitleChange(e) {
        this.setState({ contracttitle: e.target.value });
        console.log(e.target.value);

    }

    handleContractIdChange(e) {
        this.setState({ contractId: e.target.value });
        console.log(e.target.value);

    }

    handleAgentIdChange(e) {
        this.setState({ AgentId: e.target.value });
        console.log(e.target.value);


    }
    handleTemplateIdChange(e) {
        this.setState({ TemplateId: e.target.value });
        console.log(e.target.value);
    }
    

    handleClientIdChange(e) {
        this.setState({ clientId: e.target.value });
        console.log(e.target.value);

    }

    


    handleContractNameChange(e) {
        this.setState({ contractname: e.target.value });
        console.log(e.target.value);
    }

    handleWitness1NameChange(e) {
        this.setState({ Witness1Name: e.target.value });
        console.log(e.target.value);

        

    }
    handleWitness2NameChange(e) {
        this.setState({ Witness2Name: e.target.value });
        console.log(e.target.value);
    }
    
    
    

    

    handleContractEndDateChange(date) {
        this.setState({ contractendDate: date });
        console.log(date);
    }

    handleFirstPayoutDateChange(date) {
        this.setState({ firstpayoutDate: date });
        console.log(date);
    }

    handleLastPayoutDateChange(date) {
        this.setState({ lastpayoutDate: date });
        console.log(date);
    }

    handleSubscriptionamountPayDateChange(date) {
        this.setState({ subscriptionamountpayDate: date });
        console.log(date);
    }

    handleAgentNameChange(e) {
        
        this.setState({ agentname: e.target.value });
        console.log(e.target.value);
    }

   

      handleMonthlyProfitPercentageChange(e){
       let monthlyprofitpay = 0;
       if(this.state.currency > 0) {
             monthlyprofitpay = (this.state.currency * e.target.value)/100;       
           }

           this.setState({ 
          MonthlyProfitPercentage: e.target.value,
          monthlyprofitpay
        });
        console.log(e.target.value);
      }

      handleContractStartDateChange(date, e) {
       console.log('date',date)
       let addMonths = date._d.getDate() <= 15 ? 3 : 4;
       let firstpayoutDate = moment(date).add('months', addMonths).endOf('month');
       this.setState({ firstpayoutDate: firstpayoutDate });

       let lastpayoutDate = firstpayoutDate.clone().add('months', (e.target.value)-1).endOf('month');
      this.setState({ lastpayoutDate: lastpayoutDate });
     

      // Subscription amount paydate
      let subscriptionamountpayDate = lastpayoutDate.clone().add('months', 1).endOf('month');
      this.setState({ subscriptionamountpayDate: subscriptionamountpayDate });

        this.setState({ contractstartDate: date._d });
        
        console.log("today", this.state.today);
        console.log("date", date._d);

    }

      handleContractMonthsChange(e) {
        let contractstartDate = 0;
       
      let addMonths = moment(this.state.contractstartDate)._d.getDate() <= 15 ? 3 : 4;
      let firstpayoutDate = moment(this.state.contractstartDate).add('months', addMonths).endOf('month');
      this.setState({ firstpayoutDate: firstpayoutDate });

      
      let lastpayoutDate = firstpayoutDate.clone().add('months', (e.target.value)-1).endOf('month');
      this.setState({ lastpayoutDate: lastpayoutDate });
     

      // Subscription amount paydate
      let subscriptionamountpayDate = lastpayoutDate.clone().add('months', 1).endOf('month');
      this.setState({ subscriptionamountpayDate: subscriptionamountpayDate });

      let Profitamount = 0;
       if(this.state.currency > 0) {
             Profitamount = (this.state.currency * e.target.value * this.state.contractMonths)/100;       
           }
     
      this.setState({ contractMonths: e.target.value, Profitamount });
      console.log(e.target.value);
      console.log(this.state.today);


    }

      

      handleTotalProfitPercentageChange(e){
        let Profitamount = 0;
       if(this.state.currency > 0) {
             Profitamount = (this.state.currency * e.target.value * this.state.contractMonths)/100;       
           }

           this.setState({ 
          TotalProfitPercentage: e.target.value,
          Profitamount
        });
        console.log(e.target.value);
      }



       handleSubscrtiptionAmountChange(e) {
          let Quarterpercentage = 0;
          if(this.state.currency > 0) {
             Quarterpercentage = (this.state.currency * e.target.value)/100;       
           }

        this.setState({ 
          subscriptionamount: e.target.value,
          Quarterpercentage
        });
        console.log(e.target.value);

    }

    handleContractValueChange(e) {
      let Quarterpercentage = 0;
      let monthlyprofitpay = 0;
      let Profitamount = 0;

      if(this.state.subscriptionamount > 0) {
         Quarterpercentage = (this.state.subscriptionamount * e.target.value)/100;       
       }
       if(this.state.MonthlyProfitPercentage > 0) {
         monthlyprofitpay = (this.state.MonthlyProfitPercentage * e.target.value)/100;       
       }
       if(this.state.TotalProfitPercentage > 0) {
         Profitamount = (this.state.TotalProfitPercentage * e.target.value)/100;       
       }

       
      this.setState({ 
         currency: e.target.value,
         Quarterpercentage,
         monthlyprofitpay,
         Profitamount
      });
        console.log(e.target.value);
     }


     



    handlePassportNumberChange(e) {
        this.setState({ passportnumber: e.target.value });
        console.log(e.target.value);

    }
    handleSharesCountChange(e) {
        let wf = numberToWords.toWords(e.target.value);
        this.setState({ sharescount: e.target.value });
        console.log(wf);

    }
    handleMonthlyProfitPayChange(e) {
        
        this.setState({ monthlyprofitpay: e.target.value });
        console.log(e.target.value);

    }

    handleClientShareHolderNameChange(e){
        this.setState({ClientShareHolderName: e.target.value});
       console.log(e.target.value);

      }
      handleClientNRICNumberChange(e){
        this.setState({ClientNRICNumber: e.target.value});
       console.log(e.target.value);

      }
      handleClientAddressChange(e){
        this.setState({ClientAddress: e.target.value});
       console.log(e.target.value);

      }
      handleClientEmailChange(e){
        this.setState({ClientEmail: e.target.value});
       console.log(e.target.value);

      }
      handleClientAttnChange(e){
        this.setState({ClientAttn: e.target.value});
       console.log(e.target.value);

      }
      handleQuarterPercentageChange(e){
        this.setState({Quarterpercentage: e.target.value});
       console.log(e.target.value);

      }
    
      handleProfitamountChange(e){
        this.setState({Profitamount: e.target.value});
       console.log(e.target.value);

      }
       

      handleAdditionalProfitPercentageChange(e){
        this.setState({AdditionalProfitPercentage: e.target.value});
       console.log(e.target.value);

      }
      handleExtensionAmountChange(e){
        this.setState({ExtensionAmount: e.target.value});
       console.log(e.target.value);

      }
      handleAdditionalProfitAmountChange(e){
        this.setState({AdditionalProfitAmount: e.target.value});
       console.log(e.target.value);

      }
      handleCompanyemailChange(e){
        this.setState({Companyemail: e.target.value});
       console.log(e.target.value);

      }
      handleCompanyattnChange(e){
        this.setState({Companyattn: e.target.value});
       console.log(e.target.value);

      }
      handleFirstWitnessNRICnumberChange(e){
        this.setState({FirstWitnessNRICnumber: e.target.value});
       console.log(e.target.value);

      }
      handleSecondWitnessNRICnumberChange(e){
        this.setState({SecondWitnessNRICnumber: e.target.value});
       console.log(e.target.value);

      }

   handleClientNameChange(e) {
        this.setState({ clientname: e.target.value });
        console.log(e.target.value);
        let data = {
            id: e.target.value,
        };

        ClientAction._getSingleClient(data);

    }
    handleTemplateNameChange(e) {
        this.setState({ templatename: e.target.value });
        console.log(e.target.value);
        let data = {
            id: e.target.value,
        };

        TemplateAction._getSingleTemplate(data);
    }

    handleEditorChange() {
        console.log("varma");
        let singletemplate = TemplateStore._getSingleTemplate() || {};
        console.log("inside editor", singletemplate);
        this.setState({ singletemplate });
        this.setState({ editorContent: singletemplate.templates.html });
    }

    handleorgnameChange(e) {
        this.setState({ orgname: e.target.value });
        console.log(e.target.value);

    }

    onChange(evt) {
        var newContent = evt.editor.getData();
        this.setState({ editorContent: newContent });
        // console.log("CKEditor content", newContent);

    }

    _createContractDetails(e) {
        e.preventDefault();
        var op = localStorage.getItem('operation');


        let data = {
            id:this.state.id,
            contractId: this.state.contractId,
            name: this.state.contractname ? this.state.contractname : this.state.name,
            title: this.state.contracttitle ? this.state.contracttitle : this.state.title ,
            orgId: this.state.orgname !=-1 ? this.state.orgname : this.state.orgId,
            templateId: this.state.templatename !=-1 ? this.state.templatename : this.state.templateId,
            clientId: this.state.clientname !=-1 ? this.state.clientname : this.state.clientId ,
            html: this.state.editorContent ? this.state.editorContent : this.state.html,
            status : 0,
            "fieldsValue": [ {
                 "fieldName": "Contract Value",
                 "fieldValue": this.state.currency,
                 "fieldDataType": "integer",
                 
                }, 
                {
                 "fieldName": "Contract Months",
                 "fieldDataType": "integer",
                 "fieldValue": this.state.contractMonths
                }, 
                {
                 "fieldName": "Contract Start Date",
                 "fieldDataType": "date",
                 "fieldValue": this.state.contractstartDate
                }, 
                {
                 "fieldName": "Contract End Date",
                 "fieldDataType": "date",
                 "fieldValue": this.state.subscriptionamountpayDate
                }, 
                {
                 "fieldName": "Monthly Subscription Amount Payback percent",
                 "fieldDataType": "string",
                 "fieldValue": this.state.subscriptionamount
                }, 
                {
                 "fieldName": "Monthly Subscription amount Payback",
                 "fieldDataType": "string",
                 "fieldValue": this.state.Quarterpercentage
                }, 
                {
                 "fieldName": "Monthly profit payout percentage",
                 "fieldDataType": "string",
                 "fieldValue": this.state.MonthlyProfitPercentage
                }, 
                {
                 "fieldName": "Monthly Profit pay by Company",
                 "fieldDataType": "string",
                 "fieldValue": this.state.monthlyprofitpay
                }, 
                {
                 "fieldName": "Total Profit percentage",
                 "fieldDataType": "string",
                 "fieldValue": this.state.TotalProfitPercentage
                }, 
                {
                 "fieldName": "Profit amount",
                 "fieldDataType": "string",
                 "fieldValue": this.state.Profitamount
                }, 
                {
                 "fieldName": "First Pay out Date",
                 "fieldDataType": "date",
                 "fieldValue": this.state.firstpayoutDate
                }, 
                {
                 "fieldName": "Last Pay out Date",
                 "fieldDataType": "date",
                 "fieldValue": this.state.lastpayoutDate
                }, 
                {
                 "fieldName": "Additional profit percentage",
                 "fieldDataType": "string",
                 "fieldValue": this.state.AdditionalProfitPercentage
                }, 
                {
                 "fieldName": "Subscription Amount Payback Date",
                 "fieldDataType": "date",
                 "fieldValue": this.state.subscriptionamountpayDate
                }, 
                
                {
                 "fieldName": "Agent NRIC/Passport Number",
                 "fieldDataType": "string",
                 "fieldValue": this.state.passportnumber
                }, 
                 
                {
                 "fieldName": "Client Id",
                 "fieldDataType": "string",
                 "fieldValue": this.state.singleclientdetails.client.id
                }, 
                {
                 "fieldName": "Client (shareholder) Name",
                 "fieldDataType": "string",
                 "fieldValue": this.state.singleclientdetails.client.name
                }, 
                {
                 "fieldName": "Client NRIC number",
                 "fieldDataType": "string",
                 "fieldValue": this.state.singleclientdetails.client.icno
                }, 
                {
                 "fieldName": "Client address",
                 "fieldDataType": "string",
                 "fieldValue": this.state.singleclientdetails.client.address
                }, 
                {
                 "fieldName": "Client email",
                 "fieldDataType": "string",
                 "fieldValue": this.state.singleclientdetails.client.email
                }, 
                {
                 "fieldName": "Client attn",
                 "fieldDataType": "string",
                 "fieldValue": this.state.ClientAttn
                }, 
                {
                 "fieldName": "No of Preference Shares",
                 "fieldDataType": "integer",
                 "fieldValue": this.state.sharescount
                }, 
                {
                 "fieldName": "Extension amount",
                 "fieldDataType": "string",
                 "fieldValue": this.state.ExtensionAmount
                }, 
                {
                 "fieldName": "Additional profit amount",
                 "fieldDataType": "string",
                 "fieldValue": this.state.AdditionalProfitAmount
                }, 
                {
                 "fieldName": "Company email",
                 "fieldDataType": "string",
                 "fieldValue": this.state.Companyemail
                }, 
                {
                 "fieldName": "Company attn",
                 "fieldDataType": "string",
                 "fieldValue": this.state.Companyattn
                }, 
                {
                 "fieldName": "Witness 1 NRIC number",
                 "fieldDataType": "string",
                 "fieldValue": this.state.FirstWitnessNRICnumber
                }, 
                {
                 "fieldName": "Witness 2 NRIC number",
                 "fieldDataType": "string",
                 "fieldValue": this.state.SecondWitnessNRICnumber
                }, 
                {
                 "fieldName": "Witness-1 Name",
                 "fieldDataType": "string",
                 "fieldValue": this.state.Witness1Name
                }, 
                {
                 "fieldName": "Witness-2 Name",
                 "fieldDataType": "string",
                 "fieldValue": this.state.Witness2Name
                }, 
                {
                 "fieldName": "Template Id",
                 "fieldDataType": "string",
                 "fieldValue": this.state.singletemplate.template.id
                }
                ]

        };
        let edit = {
            id:this.state.id,
            contractId: this.state.contractId,
            name: this.state.contractname ? this.state.contractname : this.state.name,
            title: this.state.contracttitle ? this.state.contracttitle : this.state.title ,
            orgId: this.state.orgname !=-1 ? this.state.orgname : this.state.orgId,
            templateId: this.state.templatename !=-1 ? this.state.templatename : this.state.templateId,
            clientId: this.state.clientname !=-1 ? this.state.clientname : this.state.clientId ,
            html: this.state.editorContent ? this.state.editorContent : this.state.html,
            status : 0,
        };
        console.log(edit);

        if(op == 'add')
            ContractAction._createContractDetails(data);
        else if(op=='edit')
            ContractAction._updateContractDetails(data);
    }

    onImageDrop(files) {
        this.setState({
            uploadedFile: files[0]
        });

        this.handleImageUpload(files[0]);
    }

    handleImageUpload(file) {

        let upload = request.post(CLOUDINARY_UPLOAD_URL)
            .field('upload_preset', CLOUDINARY_UPLOAD_PRESET)
            .field('file', file);

        upload.end((err, response) => {
            if (err) {
                console.error(err);
            }

            if (response.body.secure_url !== '') {
                this.setState({
                    picture: response.body.secure_url
                });

            }
        });

    }





   
    logSig = () => {
        
        const signaturedata = this.signaturePad.toDataURL();
        

        const signatureImg = '<img alt src=' + signaturedata + ' style="width:100px;"/> ';
        const { editorContent, signDialogOpenedFor } = this.state;

        let elem = editorContent ? this.getElemForPDF(editorContent, signDialogOpenedFor, signatureImg) : signatureImg;
        
        this.setState({
            openSignatureDialog: false,
            signDialogOpenedFor: '',
            editorContent:elem
        });
    }

    

   


    getElemForPDF(editorContent, signDialogOpenedFor, signatureImg) {
        let signatureKey = '';

        switch(signDialogOpenedFor) {
            case 'agent' :      signatureKey = 'Agent Signature'; break;
            case 'client' :     signatureKey = 'Client Signature'; break;
            case 'witness-1' :  signatureKey = 'Witness-1 Signature'; break;
            case 'witness-2' :  signatureKey = 'Witness-2 Signature'; break;
        }

        return editorContent.replace(new RegExp('\\$\\$' + signatureKey + '\\$\\$', 'g'), signatureImg);
    }

    getFiles(files){
    this.setState({ files: files })
  }


    _closeDialog() {
        this.setState({
            openSignatureDialog: false,
            signDialogOpenedFor: ''
        })
    }

    _openSignatureDialog(signDialogOpenedFor) {
        console.log('signDialogOpened:', signDialogOpenedFor);
        this.setState({
            openSignatureDialog: true,
            signDialogOpenedFor: signDialogOpenedFor
        });
    }

    render() {
      
      //var wf = numberToWords.toWords(13);
      
      let singleclientdetails = this.state.singleclientdetails;
      let singletemplate = this.state.singletemplate;
      let userroleslist = this.state.userroleslist;
      var op = localStorage.getItem('operation');  

      let roleslist = this.state.userroleslist.user.role.permission || {};
      console.log('roleslist',roleslist);
      

             
        return (
            <div>

                <div className="sidebar-overlay" id="sidebar-overlay"></div>
                <div class="sidebar-mobile-menu-handle" id="sidebar-mobile-menu-handle"></div>
                <div class="mobile-menu-handle"></div>
                <div className="content_block">
                <div className="title-block">
                    <div className="row">
                        <div className="col-md-12 d-flex align-items-center">
                            <h5 className="title mr-auto"> {op== 'add' ? 'Create Contract' : 'Edit Contract'} </h5>

                            <div>
                                {
                                    roleslist.map((roles)=>{
                                        if(roles.moduleName == "Contracts" && roles.permissionName == "Create"){
                                            return(
                                              <button type="submit" className=" ml-2 mr-0 btn btn-primary" onClick={this.updateEditorData}> Insert into Contract </button>
                                            
                                            )
                                          }     
                                        })
                                 }  
                                 {
                                    roleslist.map((roles)=>{
                                        if(roles.moduleName == "Contracts" && roles.permissionName == "Create"){
                                            return(
                                            <button type="submit" className=" ml-2 mr-0 btn btn-primary" onClick={this._createContractDetails}> {op == 'add' ? 'Submit' : 'Update'} </button>
                                            
                                            )
                                          }     
                                        })
                                 }  
                                
                                
                                <Link to="/contractlist" type="submit" className=" ml-2 mr-0 btn btn-primary"> Close </Link>


                            </div>
                        </div>
                    </div>
                </div>
                <br />
                <form name="item">
                    <div className="card">
                       <div className="card-body">
                        <div className="row">
                            <div className="col-md-4">
                                <div className="form-group d-flex">
                                    <label className=" form-control-label text-xs-right"> Contract ID: </label>
                                    <div className="col-sm-8 ml-2">
                                        <input type="text" className="form-control box_ip" id="Contract Id" placeholder="Contract ID" onChange={this.handleContractIdChange} name='' value={this.state.contractId} disabled/>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group d-flex">
                                    <label className="form-control-label text-xs-right"> Created Date: </label>
                                    <div className="col-sm-8 ml-2">
                                        <input type="text" className="form-control box_ip" id="Created Date" placeholder="Created Date" value={this.state.date} disabled/>

                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="form-group d-flex">
                                    <label className="form-control-label text-xs-right"> Last Edited Date: </label>
                                    <div className=" col-sm-8 ml-2">
                                        <input type="text" className="form-control box_ip" placeholder="Last Edited Date" />
                                    </div>

                                </div>
                            </div>
                        </div>

                       
                        <div className="form-group row">

                            <label className="col-sm-2 form-control-label text-xs-right" > Contract Title: </label>
                            <div className="col-sm-3">
                                <input type="text" className="form-control box_ip" placeholder="Contract Title" onChange={this.handleContractTitleChange} name='' id='contracttitle' value={this.state.contracttitle ? this.state.contracttitle : this.state.title} />
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <label className="col-sm-2 form-control-label text-xs-right"> Contract Name: </label>
                            <div className="col-sm-3">
                                <input type="text" className="form-control box_ip" placeholder="Contract Name" onChange={this.handleContractNameChange} name='' id='contractname' value={this.state.contractname ? this.state.contractname : this.state.name} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor=" " className="col-sm-2 form-control-label text-xs-right">Client Name:</label>
                            <div className="col-sm-3">
                                <select value={this.state.clientname ==-1 ? this.state.clientId : this.state.clientname} className="c-select form-control box_ip" id='clientname' onChange={this.handleClientNameChange} >
                                    <option value='-1' disabled>Select Client</option>
                                    {this.state.clientdetails.clients.map((el, i) => <option key={i} value={el.id}>{el.name}</option>)}

                                </select>
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <label htmlFor=" " className="col-sm-2 form-control-label text-xs-right">Select Template:</label>
                            <div className="col-sm-3">
                                <select className="c-select form-control box_ip" onChange={this.handleTemplateNameChange} id='templatename' value={this.state.templatename == -1 ? this.state.templateId : this.state.templatename}>
                                    <option value='-1' disabled>Select Template</option>
                                    {this.state.templatelist.templates.map((el, i) => <option key={i} name={el.formId} value={el.id}>{el.name}</option>)}


                                </select>
                            </div>
                        </div>
                        <div className="form-group row">
                            <label htmlFor=" " className="col-sm-2 form-control-label text-xs-right">Select Organization:</label>
                            <div className="col-sm-3">
                                <select className="c-select form-control box_ip" id='Organization Name' onChange={this.handleorgnameChange} value={this.state.orgname == -1 ? this.state.orgId : this.state.orgname}>
                                    <option value='-1' disabled>Select Organization</option>
                                    {this.state.organizationlist.organizations.map((el, i) => <option key={i} value={el.id}>{el.name}</option>)}
                                </select>
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                              <label className="col-sm-2 form-control-label text-xs-right" > Template Id: </label>
                            <div className="col-sm-3">
                                <input type="text" className="form-control box_ip" placeholder=" Template Id" id="Template Id" onChange={this.handleTemplateIdChange} name='' value={singletemplate.template.id} disabled/>
                            </div>       
                        </div>

                        <div className="form-group row">
                           <div className="col-sm-3">
                          {this.state.formFields.map((fieldItem, index) =>
                              <FormField key={index}  configs={fieldItem} value={this.state[fieldItem.fieldName]} onChange={this.handleFieldValueChange}/>
                          )}
                          </div>
                        </div>


                        <div className="form-group row">

                            <label className="col-sm-2 form-control-label text-xs-right"> Contract Value: </label>
                            <div className="col-sm-3">
                                <input type="text" className="form-control box_ip" placeholder="Contract Amount" id="Contract Value" onChange={this.handleContractValueChange} value={this.state.currency} />
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <label className="col-sm-2 form-control-label text-xs-right"> Contract Months: </label>
                            <div className="col-sm-3">
                                <input type="text" className="form-control box_ip" placeholder="Contract Months" id="Contract Months" onChange={this.handleContractMonthsChange} name='' value={this.state.contractMonths} />
                            </div>
                        </div>
                        <div className="form-group row">
                            <label className="col-sm-2 form-control-label text-xs-right"> Contract Start Date: </label>
                            <div className="col-sm-3">
                                <DatePicker
                                    
                                    className="form-control box_ip"
                                    selected={this.state.contractstartDate ? moment(this.state.contractstartDate) : undefined}
                                    onChange={this.handleContractStartDateChange}
                                    id="Contract Start Date"
                                />
                                 
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <label className="col-sm-2 form-control-label text-xs-right"> Contract End Date: </label>
                            <div className="col-sm-3">
                                <DatePicker
                                    
                                    className="form-control box_ip"
                                    selected={this.state.subscriptionamountpayDate ? moment(this.state.subscriptionamountpayDate) : undefined}
                                    onChange={this.handleContractEndDateChange}
                                    id="Contract End Date"
                                    disabled
                                />
                            </div>

                        </div>

                        <div className="form-group row">
                            <label className="col-sm-2 form-control-label text-xs-right"> Monthly Subscription Amount Payback percent</label>
                            <div className="col-sm-3">
                                <input type="text" className="form-control box_ip" placeholder="SGD" id="Subscription Amount" onChange={this.handleSubscrtiptionAmountChange} name='Subscription Amount' value={this.state.subscriptionamount} />
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            
                            <label className="col-sm-2 form-control-label text-xs-right"> Monthly Subscription amount Payback: </label>
                                        <div className="col-sm-3">
                                            <input type="text" className="form-control box_ip" placeholder="Monthly Subscription amount Payback" id="Monthly Subscription amount Payback" onChange={this.handleQuarterPercentageChange} value={this.state.Quarterpercentage} disabled/> </div>    

                        </div>

                        <div className="form-group row">
                        <label className="col-sm-2 form-control-label text-xs-right"> Monthly profit payout percentage: </label>
                                        <div className="col-sm-3">
                                            <input type="text" className="form-control box_ip" placeholder="Profit percentage" id="Monthly profit percentage" onChange={this.handleMonthlyProfitPercentageChange} value={this.state.MonthlyProfitPercentage} /> </div>
                            
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <label className="col-sm-2 form-control-label text-xs-right"> Monthly Profit pay by Company: </label>
                            <div className="col-sm-3">
                                <input type="text" className="form-control box_ip" placeholder="Monthly Profit pay" id="Monthly Profit pay by Company" onChange={this.handleMonthlyProfitPayChange} value={this.state.monthlyprofitpay} disabled/> </div>
                        </div>

                        <div className="form-group row">
                                        <label className="col-sm-2 form-control-label text-xs-right"> Total Profit percentage: </label>
                                        <div className="col-sm-3">
                                            <input type="text" className="form-control box_ip" placeholder="Profit percentage" id="Total Profit percentage" onChange={this.handleTotalProfitPercentageChange} value={this.state.TotalProfitPercentage} /> </div>
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <label className="col-sm-2 form-control-label text-xs-right"> Profit amount: </label>
                                        <div className="col-sm-3">
                                            <input type="text" className="form-control box_ip" placeholder="Profit amount" id="Profit amount" onChange={this.handleProfitamountChange} value={this.state.Profitamount} disabled/> </div>
                                        </div>

                        <div className="form-group row">
                            
                                <label className="col-sm-2 form-control-label text-xs-right"> First Pay out Date: </label>
                            <div className="col-sm-3">
                                <DatePicker
                                    className="form-control box_ip"
                                    selected={this.state.firstpayoutDate ? moment(this.state.firstpayoutDate) : undefined}
                                    onChange={this.handleFirstPayoutDateChange}
                                    id="First Pay out Date"
                                    disabled
                                />
                            </div>
                           &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <label className="col-sm-2 form-control-label text-xs-right"> Last Pay out Date: </label>
                            <div className="col-sm-3">
                                <DatePicker
                                    className="form-control box_ip"
                                    selected={this.state.lastpayoutDate ? moment(this.state.lastpayoutDate) : undefined}
                                    onChange={this.handleLastPayoutDateChange}
                                    id="Last Pay out Date"
                                    disabled
                                />
                            </div>
                            </div>




                        
                       
                        <div className="form-group row">
                            

                            <label className="col-sm-2 form-control-label text-xs-right"> Additional profit percentage: </label>
                            <div className="col-sm-3">
                                <input type="text" className="form-control box_ip" placeholder="Additional profit percentage" id="Additional profit percentage" onChange={this.handleAdditionalProfitPercentageChange} value={this.state.AdditionalProfitPercentage} /> </div>

                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <label className="col-sm-2 form-control-label text-xs-right"> Subscription Amount Payback Date: </label>
                            <div className="col-sm-3">
                                <DatePicker
                                    className="form-control box_ip"
                                    selected={this.state.subscriptionamountpayDate ? moment(this.state.subscriptionamountpayDate) : undefined}
                                    onChange={this.handleSubscriptionamountPayDateChange}
                                    id="Subscription Amount Payback Date"
                                    disabled
                                />
                            </div>

                        </div>

                        


                        <div className="form-group row">
                            <label className="col-sm-2 form-control-label text-xs-right"> Agent Name: </label>
                            <div className="col-sm-3">
                                <input type="text" className="form-control box_ip" placeholder="Agent Name"
                                    id="Agent Name"  name='Agent Name' value={userroleslist.user.name} disabled/>
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <label className="col-sm-2 form-control-label text-xs-right"> Agent NRIC/Passport Number: </label>
                            <div className="col-sm-3">
                                <input type="text" className="form-control box_ip" placeholder="NRIC/Passport Number" id="Agent NRIC/Passport Number" onChange={this.handlePassportNumberChange} value={userroleslist.user.nircNumber} disabled/> </div>
                        </div>

                         <div className="form-group row">

                            <label className="col-sm-2 form-control-label text-xs-right" > Agent Id: </label>
                            <div className="col-sm-3">
                                <input type="text" className="form-control box_ip" placeholder=" Agent Id" id="Agent Id" onChange={this.handleAgentIdChange} name='' value={userroleslist.user.id} disabled/>
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <label className="col-sm-2 form-control-label text-xs-right"> Client Id: </label>
                            <div className="col-sm-3">
                                <input type="text" className="form-control box_ip" placeholder="Client Id" id="Client Id" onChange={this.handleClientIdChange} name='' value={singleclientdetails.client.id} disabled/>
                            </div>
                        </div>
                        

                          <div className="form-group row">
                                        <label className="col-sm-2 form-control-label text-xs-right"> Client (shareholder) Name: </label>
                                        <div className="col-sm-3">
                                            <input type="text" className="form-control box_ip" placeholder="Client (shareholder) Name" id="Client Name" onChange={this.handleClientShareHolderNameChange} value={singleclientdetails.client.name} disabled/> </div>
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <label className="col-sm-2 form-control-label text-xs-right"> Client NRIC number: </label>
                                        <div className="col-sm-3">
                                            <input type="text" className="form-control box_ip" placeholder="NRIC number" id="Client NRIC number" onChange={this.handleClientNRICNumberChange} value={singleclientdetails.client.nircNumber} disabled/> </div>
                                        </div> 


                                        <div className="form-group row">
                                        <label className="col-sm-2 form-control-label text-xs-right"> Client address: </label>
                                        <div className="col-sm-3">
                                            <input type="text" className="form-control box_ip" placeholder="Client address" id="Client address" onChange={this.handleClientAddressChange} value={singleclientdetails.client.address} disabled/> </div>
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <label className="col-sm-2 form-control-label text-xs-right"> Client email: </label>
                                        <div className="col-sm-3">
                                            <input type="text" className="form-control box_ip" placeholder="Client email" id="Client email" onChange={this.handleClientEmailChange} value={singleclientdetails.client.email} disabled/> </div>
                                        </div>

                                        <div className="form-group row">
                                        <label className="col-sm-2 form-control-label text-xs-right"> Client attn: </label>
                                        <div className="col-sm-3">
                                            <input type="text" className="form-control box_ip" placeholder="Client attn" id="Client attn" onChange={this.handleClientAttnChange} value={singleclientdetails.client.attention} disabled/> </div>
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <label className="col-sm-2 form-control-label text-xs-right"> No of Preference Shares: </label>
                            <div className="col-sm-3">
                                <input type="text" className="form-control box_ip" placeholder="No of Shares" id="No of Preference Shares" onChange={this.handleSharesCountChange} value={this.state.sharescount} /> </div>
                                        
                            
                                        </div>

                                        

                                        


                                        <div className="form-group row">
                                        <label className="col-sm-2 form-control-label text-xs-right"> Extension amount: </label>
                                        <div className="col-sm-3">
                                            <input type="text" className="form-control box_ip" placeholder="Extension amount" id="Extension amount" onChange={this.handleExtensionAmountChange} value={this.state.ExtensionAmount} /> </div>
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <label className="col-sm-2 form-control-label text-xs-right"> Additional profit amount: </label>
                                        <div className="col-sm-3">
                                            <input type="text" className="form-control box_ip" placeholder="Additional profit amount" id="Additional profit Amount" onChange={this.handleAdditionalProfitAmountChange} value={this.state.AdditionalProfitAmount} /> </div>
                                        </div>


                                        <div className="form-group row">
                                        <label className="col-sm-2 form-control-label text-xs-right"> Company email: </label>
                                        <div className="col-sm-3">
                                            <input type="text" className="form-control box_ip" placeholder="Company email" id="Company email" onChange={this.handleCompanyemailChange} value={this.state.Companyemail} disabled/> </div>
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <label className="col-sm-2 form-control-label text-xs-right"> Company attn: </label>
                                        <div className="col-sm-3">
                                            <input type="text" className="form-control box_ip" placeholder="Company attn" id="Company attn" onChange={this.handleCompanyattnChange} value={this.state.Companyattn} /> </div>
                                        </div>


                                        
                                        <div className="form-group row">
                                        <label className="col-sm-2 form-control-label text-xs-right"> Witness 1 NRIC number: </label>
                                        <div className="col-sm-3">
                                            <input type="text" className="form-control box_ip" placeholder="Witness 1 NRIC number" id="Witness 1 NRIC number" onChange={this.handleFirstWitnessNRICnumberChange} value={this.state.FirstWitnessNRICnumber} /> </div>
                                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <label className="col-sm-2 form-control-label text-xs-right"> Witness 2 NRIC number: </label>
                                        <div className="col-sm-3">
                                            <input type="text" className="form-control box_ip" placeholder="Witness 2 NRIC number" id="Witness 2 NRIC number" onChange={this.handleSecondWitnessNRICnumberChange} value={this.state.SecondWitnessNRICnumber} /> </div>
                                        </div>

                          <div className="form-group row">
                            <label className="col-sm-2 form-control-label text-xs-right"> Witness-1 Name: </label>
                            <div className="col-sm-3">
                                <input type="text" className="form-control box_ip" placeholder="Witness Name"
                                    id="Witness-1 Name" onChange={this.handleWitness1NameChange} name='Witness-1 Name' value={this.state.Witness1Name} />
                            </div>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                        <label className="col-sm-2 form-control-label text-xs-right"> Witness-2 Name: </label>
                            <div className="col-sm-3">
                                <input type="text" className="form-control box_ip" placeholder="Witness Name" id="Witness-2 Name" onChange={this.handleWitness2NameChange} value={this.state.Witness2Name} /> </div>
                        </div>

                        

                        <div className="form-group row">
                            <label className="col-sm-2 form-control-label text-xs-right"> Agent Signature: </label>
                            <button type='button' style={{ height: '30px' }} id ="Agent Signature" className="btn btn-primary" onClick={() => {this._openSignatureDialog('agent')}}>Click For Signature</button>

                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                           <label className="col-sm-2 form-control-label text-xs-right"> Client Signature: </label>
                            <button type='button' style={{ height: '30px' }} id='Client Signature' className="btn btn-primary" onClick={() => {this._openSignatureDialog('client')}}>Click For Signature</button>

                        </div>


                        <div className="form-group row">
                            <label className="col-sm-2 form-control-label text-xs-right"> Witness-1 Signature: </label>
                            <button type='button' style={{ height: '30px' }} id='Witness-1 Signature' className="btn btn-primary" onClick={() => {this._openSignatureDialog('witness-1')}}>Click For Signature</button>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <label className="col-sm-2 form-control-label text-xs-right"> Witness-2 Signature: </label>

                            <button type='button' style={{ height: '30px' }}  className="btn btn-primary" onClick={() => {this._openSignatureDialog('witness-2')}}>Click For Signature</button>


                        </div>


                        <div className="form-group row">
                            <label className="col-sm-2 form-control-label text-xs-right"> Contract Editor: </label>

                            <div className="form-group col-sm-12">
                                <br />
                                <CKEditor id="currentCKEditor" activeClass="editor" key={this.state.editorContent} content={this.state.editorContent ? this.state.editorContent : this.state.html} events={{ "change": this.onChange, "instanceReady": this.ckeditorInstanceReady }} />
                            </div>
                        </div>


                        <div className="form-group row">
                            <label className="col-sm-2 form-control-label text-xs-right"> Upload File: </label>
                            <div >
                               <div>
                                        <FileBase64
                                        multiple={ true }
                                        onDone={ this.getFiles.bind(this) } />

                                        <div>
                                              { this.state.files.map((file,i) => {
                                                return <img key={i} src={file.base64} style={{maxWidth: "150px", margin: "15px"}}/>
                                              }) }
                                              
                                        </div>


                                        
                                    </div>

                                
                            </div>
                        </div>
                        


                    </div>
                 </div>
                </form>
               </div> 

                <div className="modal fade" id="modal-media">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Media Library</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                    <span className="sr-only">Close</span>
                                </button>
                            </div>
                            <div className="modal-body modal-tab-container">
                                <ul className="nav nav-tabs modal-tabs" role="tablist">
                                    <li className="nav-item">
                                        <a className="nav-link" href="#gallery" data-toggle="tab" role="tab">Gallery</a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link active" href="#upload" data-toggle="tab" role="tab">Upload</a>
                                    </li>
                                </ul>
                                <div className="tab-content modal-tab-content">
                                    <div className="tab-pane fade" id="gallery" role="tabpanel">
                                        <div className="images-container">
                                            <div className="row">
                                                <div className="col-6 col-sm-4 col-md-4 col-lg-3">
                                                    <div className="image-container">
                                                        <div className="image" style={{ backgroundImage: `url('https://s3.amazonaws.com/uifaces/faces/twitter/brad_frost/128.jpg')` }}></div>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-sm-4 col-md-4 col-lg-3">
                                                    <div className="image-container">
                                                        <div className="image" style={{ backgroundImage: `url('https://s3.amazonaws.com/uifaces/faces/twitter/_everaldo/128.jpg')` }}></div>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-sm-4 col-md-4 col-lg-3">
                                                    <div className="image-container">
                                                        <div className="image" style={{ backgroundImage: `url('https://s3.amazonaws.com/uifaces/faces/twitter/eduardo_olv/128.jpg')` }}></div>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-sm-4 col-md-4 col-lg-3">
                                                    <div className="image-container">
                                                        <div className="image" style={{ backgroundImage: `url('https://s3.amazonaws.com/uifaces/faces/twitter/brad_frost/128.jpg')` }}></div>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-sm-4 col-md-4 col-lg-3">
                                                    <div className="image-container">
                                                        <div className="image" style={{ backgroundImage: `url('https://s3.amazonaws.com/uifaces/faces/twitter/_everaldo/128.jpg')` }}></div>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-sm-4 col-md-4 col-lg-3">
                                                    <div className="image-container">
                                                        <div className="image" style={{ backgroundImage: `url('https://s3.amazonaws.com/uifaces/faces/twitter/eduardo_olv/128.jpg')` }}></div>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-sm-4 col-md-4 col-lg-3">
                                                    <div className="image-container">
                                                        <div className="image" style={{ backgroundImage: `url('https://s3.amazonaws.com/uifaces/faces/twitter/brad_frost/128.jpg')` }}></div>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-sm-4 col-md-4 col-lg-3">
                                                    <div className="image-container">
                                                        <div className="image" style={{ backgroundImage: `url('https://s3.amazonaws.com/uifaces/faces/twitter/_everaldo/128.jpg')` }}></div>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-sm-4 col-md-4 col-lg-3">
                                                    <div className="image-container">
                                                        <div className="image" style={{ backgroundImage: `url('https://s3.amazonaws.com/uifaces/faces/twitter/eduardo_olv/128.jpg')` }}></div>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-sm-4 col-md-4 col-lg-3">
                                                    <div className="image-container">
                                                        <div className="image" style={{ backgroundImage: `url('https://s3.amazonaws.com/uifaces/faces/twitter/brad_frost/128.jpg')` }}></div>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-sm-4 col-md-4 col-lg-3">
                                                    <div className="image-container">
                                                        <div className="image" style={{ backgroundImage: `url('https://s3.amazonaws.com/uifaces/faces/twitter/_everaldo/128.jpg')` }}></div>
                                                    </div>
                                                </div>
                                                <div className="col-6 col-sm-4 col-md-4 col-lg-3">
                                                    <div className="image-container">
                                                        <div className="image" style={{ backgroundImage: `url('https://s3.amazonaws.com/uifaces/faces/twitter/eduardo_olv/128.jpg')` }}></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="tab-pane fade active in" id="upload" role="tabpanel">
                                        <div className="upload-container">
                                            <div id="dropzone">
                                                <form action="/" method="POST" enctype="multipart/form-data" className="dropzone needsclick dz-clickable" id="demo-upload">
                                                    <div className="dz-message-block">
                                                        <div className="dz-message needsclick"> Drop files here or click to upload. </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary">Insert Selected</button>
                            </div>
                        </div>

                    </div>

                </div>

                <div className="modal fade" id="confirm-modal">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">
                                    <i className="fa fa-warning"></i> Alert</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure want to do this?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" data-dismiss="modal">Yes</button>
                                <button type="button" className="btn btn-secondary" data-dismiss="modal">No</button>
                            </div>
                        </div>

                    </div>

                </div>

                <Dialog
                    title={
                        <div className="savedchart_header dashboard_savedchart">

                            <ul className="top_row_right  list-inline clearfix" style={{ width: '100%' }}>
                                <li className="pull-left" > Signature </li>
                                <li className="pull-right"><a className="ml-2 mr-0 btn btn-primary " onClick={this._closeDialog.bind(this)}>Close</a></li>
                                <button type='button' style={{ float: 'right' }} className="ml-2 mr-0 btn btn-primary" onClick={this.logSig.bind(this)}>submit</button>
                            </ul>
                        </div>}
                    className=""
                    open={this.state.openSignatureDialog}
                    modal={false}
                    autoScrollBodyContent={true}
                    contentStyle={{ maxWidth: 'none' }}
                    onRequestClose={this._closeDialog} >

                    <div className="" style={{ height: '200px' }}>
                        <div style={{ backgroundColor: '#f1f1f1', width: '300px', height: '150px' }}>
                            <SignaturePad clearButton="true"  ref={ref => this.signaturePad = ref} />

                        </div>
                    </div>
                </Dialog>


            </div>
        )
    }
}

export default ContractDetails;





