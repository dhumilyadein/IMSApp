const SalaryTemplates = require("../../models/SalaryTemplates");
const Users = require("../../models/User");
const Teacher = require("../../models/Teacher");

const Admin = require("../../models/Admin");
const PaidSalary = require("../../models/PaidSalary");


module.exports = function (app) {


    async function addSalaryTemplate(req, res) {
        console.log("in Add Fee Req.body: " + JSON.stringify(req.body))

        var template = {
            "templateName": req.body.templateName, "status": "Active", "salaryRows": req.body.salaryRows,
            "deductRows": req.body.deductRows, "totalEarning": req.body.totalEarning, "totalDeduction": req.body.totalDeduction,
            "paidAmount": req.body.paidAmount,

        };
        var addTemplate = new SalaryTemplates(template);





        await addTemplate
            .save()
            .then(user => {
                return res.send({ msg: "Success" });
            })
            .catch(err => {
                return res.send(err);
            });

    }
    async function paySalary(req, res) {
        console.log("in paySal Req.body: " + JSON.stringify(req.body.dop));
        console.log("username: " + JSON.stringify(req.body.selectedEmp.value.substring(req.body.selectedEmp.value.indexOf('(') + 1,
            req.body.selectedEmp.value.indexOf(')'))));

        if (req.body.empType === "Admin") {
            await Admin
                .findOne({
                    username: req.body.selectedEmp.value.substring(req.body.selectedEmp.value.indexOf('(') + 1,
                        req.body.selectedEmp.value.indexOf(')'))
                })
                .then(data => {
                    console.log("EmpNO: " + JSON.stringify(data.doj));

                    var string = {
                        "empDetails": {
                            "empNo": data.employeeno
                            , "empName": req.body.selectedEmp.value, "doj": data.doj
                        }, "salaryRows":
                            req.body.salaryRows, "deductRows": req.body.deductRows,"totalEarning":
 req.body.totalEarning, "totalDeduction": req.body.totalDeduction, "paidAmount":
                            req.body.paidAmount, "month": req.body.month, "dop": req.body.dop, "remarks": req.body.remarks
                    };
                


                    console.log("template: " + JSON.stringify(string));
                    var addPaidSalary = new PaidSalary(string);

                    addPaidSalary
                        .save()
                        .then(user => {
                            console.log("Succes Paid: " + JSON.stringify(user));
                            return res.send({ msg: "Success" });
                        })
                         .catch(err => {
                            console.log("Error Paid: " + JSON.stringify(err))
                            return res.send(err);
                        }); 




                })
                .catch(err => {  console.log("Error find: "+JSON.stringify(err))
                  return res.send({error:err});
               }); 

        }

        else if (req.body.empType === "Staff") {
            await Teacher
                .findOne({
                    username: req.body.selectedEmp.value.substring(req.body.selectedEmp.value.indexOf('(') + 1,
                        req.body.selectedEmp.value.indexOf(')'))
                })
                .then(data => {
                    console.log("EmpNO: Teacher " + JSON.stringify(data.employeeno));
                    var string = {
                        "empDetails": {
                            "empNo": data.employeeno
                            , "empName": req.body.selectedEmp.value, "doj": data.doj
                        }, "salaryRows":
                            req.body.salaryRows, "deductRows": req.body.deductRows,"totalEarning":
 req.body.totalEarning, "totalDeduction": req.body.totalDeduction, "paidAmount":
                            req.body.paidAmount, "month": req.body.month, "dop": req.body.dop, "remarks": req.body.remarks
                    };
                


                    console.log("template: " + JSON.stringify(string));
                    var addPaidSalary = new PaidSalary(string);

                    addPaidSalary
                        .save()
                        .then(user => {
                            console.log("Succes Paid: " + JSON.stringify(user));
                            return res.send({ msg: "Success" });
                        })
                         .catch(err => {
                            console.log("Error Paid: " + JSON.stringify(err))
                            return res.send(err);
                        }); 




                })
                .catch(err => {
                    return res.send({ error: err });
                });


        }






    }


    function existingSalaryTemplates(req, res) {
        console.log("in Existing temp");

        SalaryTemplates
            .find({ status: "Active" })
            .then(data => {
                return res.send(data);
            })
            .catch(err => {
                return res.send({ error: err });
            });

    }

    function fetchEmployees(req, res) {
        console.log("in fetchEmp: " + req.body.empType);

        if (req.body.empType === "Admin") {
            Users
                .find({ status: "Active", role: "admin" })
            .then(data => {
                return res.send(data);
            })
            .catch(err => {
                return res.send({ error: err });
            });

        }

        else if (req.body.empType === "Staff") {
            Users
                .find({ status: "Active", role: "teacher" })
            .then(data => {
                return res.send(data);
            })
            .catch(err => {
                return res.send({ error: err });
            });

        }

    }

    function getSalaryTemplate(req, res) {
        console.log("in getSalaryTemplate: ");

        SalaryTemplates
            .find({ status: "Active" })
            .then(data => {
                return res.send(data);
            })
            .catch(err => {
                return res.send({ error: err });
            });




    }




    async function deleteSalaryTemplate(req, res) {
        console.log("In Delete Template for: " + JSON.stringify(req.body.templateName));

        await SalaryTemplates
            .deleteOne({ templateName: req.body.templateName })
            .then(data => {
                console.log("result deleted: " + JSON.stringify(data));
                if (data) {
                    return res.send({ msg: "Template Deleted" });
                }
            })
            .catch(err => {
                return res.send({ error: err });
            });


    }

    async function updateSalaryTemplate(req, res) {
        console.log("In Update Template for: " + JSON.stringify(req.body));



        SalaryTemplates
            .updateOne({ templateName: req.body.existingSalaryRows[req.body.templateNo].templateName },
                {
                    $set: {
                        templateName: req.body.templateName,
                        salaryRows: req.body.salaryRows,
                        deductRows: req.body.deductRows,
                        totalDeduction: req.body.totalDeduction,
                        totalEarning: req.body.totalEarning,
                        paidAmount: req.body.paidAmount

                    }
                }
            )
            .then(data => {

                return res.send({ msg: "Template Updated" });
            })
            .catch(err => {
                return res.send({ error: err });
            });







    }

    async function copySalaryTemplate(req, res) {
        console.log("In Copy Template for: " + JSON.stringify(req.body));


        var template = {
            "templateName": req.body.templateName, "status": "Active", "salaryRows": req.body.salaryRows,
            "deductRows": req.body.deductRows, "totalEarning": req.body.totalEarning, "totalDeduction": req.body.totalDeduction,
            "paidAmount": req.body.paidAmount,

        };
        var copyTemplate = new SalaryTemplates(template);

        await SalaryTemplates.findOne({ templateName: req.body.templateName })
            .then(data => {
                if (data)
                    return res.send({ msg: "already exist" });

                else


                    copyTemplate
                        .save()
                        .then(user => {
                            return res.send({ msg: "Template Copied" });
                        })
                        .catch(err => {
                            return res.send(err);
                        });
            })

            .catch(err => {
                return res.send(err);
            });

    }

    app.post("/api/addSalaryTemplate", addSalaryTemplate);
    app.get("/api/existingSalaryTemplates", existingSalaryTemplates);
    app.post("/api/deleteSalaryTemplate", deleteSalaryTemplate);
    app.post("/api/updateSalaryTemplate", updateSalaryTemplate);
    app.post("/api/copySalaryTemplate", copySalaryTemplate);
    app.post("/api/fetchEmployees", fetchEmployees);

    app.post("/api/paySalary", paySalary);

    app.get("/api/getSalaryTemplate", getSalaryTemplate);



    app.get("/", (req, res) => res.json("sdasdsa"));
    //---------------------------------------------

}
