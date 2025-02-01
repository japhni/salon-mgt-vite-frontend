import { Replay } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  MenuItem,
  Paper,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import {
  getAllEmployees,
  getDebtByRequesterId,
  getDebtPaidByRefunderId,
  getEmployeeById,
  getHistoryInfosByIdAndDatesMedthod,
} from "../utils/apiFunctions";

const Inventory = () => {
  const [employeesInfo, setEmployeesInfo] = useState([]);
  const [employeeInfo, setEmployeeInfo] = useState([]);

  const [debtHistoryInfo, setDebtHistoryInfo] = useState([]);
  const [debtPaidHistoryInfo, setDebtPaidHistoryInfo] = useState([]);

  const [resultDateRangeChange, setResultDateRangeChange] = useState([]);
  const [errorMessageEmployees, setErrorMessageEmployees] = useState("");
  const [errorMessageSearchByDate, setErrorMessageSearchByDate] = useState("");

  const [searched, setSearched] = useState(false);

  const token = localStorage.getItem("token");

  const formatter = new Intl.DateTimeFormat("fr-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [open, setOpen] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const [searchQuery, setSearchQuery] = useState({
    employee_id: "",
    startDate: formatter.format(new Date()),
    endDate: formatter.format(new Date()),
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery({ ...searchQuery, [name]: value });
    const startDate = moment(searchQuery.startDate);
    const endDate = moment(searchQuery.endDate);
    if (startDate.isValid() && endDate.isValid()) {
      setErrorMessageSearchByDate("");
    }

    setSearched(false);
  };

  useEffect(() => {
    getAllEmployees()
      .then((data) => {
        setEmployeesInfo(data);
      })
      .catch((error) => {
        setErrorMessageEmployees(error.message);
      });
  }, []);

  const handleEmployeeHistorySearch = async (e) => {
    e.preventDefault();
    const startDate = moment(searchQuery.startDate);
    const endDate = moment(searchQuery.endDate);
    if (!startDate.isValid() || !endDate.isValid()) {
      setErrorMessageSearchByDate("Please enter valid dates");
      return;
    }
    if (endDate.isBefore(startDate)) {
      setErrorMessageSearchByDate(
        "La date de depart doit etre superieur a la derniere date"
      );
      return;
    }
    getHistoryInfosByIdAndDatesMedthod(
      searchQuery.employee_id,
      searchQuery.startDate,
      searchQuery.endDate
    )
      .then((response) => {
        setResultDateRangeChange(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  /* const amountPartReducer = ()=>{
      const data = resultDateRangeChange,
            keys = ['amount', 'employeePart', 'bossPart'],
            sums = data.reduce(
                  (r, o) => (keys.forEach(k => r[k] += o[k]), r), 
                  Object.fromEntries(keys.map(k => [k, 0])));

          return sums;
        }*/

  useEffect(() => {
    getEmployeeById(searchQuery.employee_id, token)
      .then((data) => {
        if (searched) {
          setEmployeeInfo(data);
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [searchQuery.employee_id, token, searched]);

  useEffect(() => {
    getDebtByRequesterId(searchQuery.employee_id, token)
      .then((data) => {
        if (searched) {
          setDebtHistoryInfo(data);
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [searchQuery.employee_id, token, searched]);

  useEffect(() => {
    getDebtPaidByRefunderId(searchQuery.employee_id, token)
      .then((data) => {
        if (searched) {
          setDebtPaidHistoryInfo(data);
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }, [searchQuery.employee_id, token, searched]);

  const data = resultDateRangeChange,
    keys = ["amount", "employeePart", "bossPart"],
    sums = data.reduce(
      (r, o) => (keys.forEach((k) => (r[k] += o[k])), r),
      Object.fromEntries(keys.map((k) => [k, 0]))
    );

  const debts = debtHistoryInfo,
    debtKey = ["debtAmount"],
    debtSums = debts.reduce(
      (r, o) => (debtKey.forEach((k) => (r[k] += o[k])), r),
      Object.fromEntries(debtKey.map((k) => [k, 0]))
    );

  const debtsPaid = debtPaidHistoryInfo,
    debtPaidKey = ["amountPaid"],
    debtPaidSums = debtsPaid.reduce(
      (r, o) => (debtPaidKey.forEach((k) => (r[k] += o[k])), r),
      Object.fromEntries(debtPaidKey.map((k) => [k, 0]))
    );

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      margin={"auto"}
      width={400}
      marginTop={10}
    >
      <Paper sx={{ padding: "32px" }} elevation={10}>
        <Card>
          <CardContent>
            {errorMessageSearchByDate && (
              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Alert
                  variant="standard"
                  severity="error"
                  onClose={() => {
                    setErrorMessageSearchByDate("");
                  }}
                >
                  {errorMessageSearchByDate}
                </Alert>
              </Snackbar>
            )}

            {errorMessageEmployees && (
              <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Alert
                  variant="standard"
                  severity="error"
                  onClose={() => {
                    setErrorMessageEmployees("");
                  }}
                >
                  {errorMessageEmployees}
                </Alert>
              </Snackbar>
            )}

            <form onSubmit={handleEmployeeHistorySearch}>
              <Stack
                spacing={2}
                direction={"row"}
                sx={{ marginRight: 3, marginBottom: 3, display: "flex" }}
              >
                <TextField
                  variant="outlined"
                  color="secondary"
                  label="Debut d'Intervalle"
                  name="startDate"
                  value={searchQuery.startDate}
                  min={moment().format("YYYY-MM-DD")}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  type="date"
                />

                <TextField
                  variant="outlined"
                  color="secondary"
                  label="Fin d'Intervalle"
                  name="endDate"
                  value={searchQuery.endDate}
                  min={moment().format("YYYY-MM-DD")}
                  onChange={handleInputChange}
                  fullWidth
                  required
                  type="date"
                />
              </Stack>
              <Stack spacing={1} sx={{ mb: 2 }}>
                <TextField
                  label="Choisir le Coiffeur"
                  value={searchQuery.employee_id}
                  onChange={handleInputChange}
                  name="employee_id"
                  select
                  fullWidth
                >
                  {employeesInfo.map((employeeInfos) => (
                    <MenuItem key={employeeInfos.id} value={employeeInfos.id}>
                      {employeeInfos.firstName + " " + employeeInfos.lastName}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>

              <Button
                variant="contained"
                color="secondary"
                type="submit"
                sx={{ mb: 2 }}
                onClick={() => setSearched(true)}
              >
                Valider
              </Button>
            </form>
            <Typography>
              {"Nombre des clients : " + resultDateRangeChange.length}
            </Typography>
            <Typography>
              {"Nom et Prenom : " +
                (employeeInfo.length !== 0
                  ? employeeInfo.firstName + " " + employeeInfo.lastName
                  : "")}
            </Typography>
            <Typography>{"Total d'argent : " + sums.amount}</Typography>
            <Divider />
            <br />
            <Typography>{"Employee : " + sums.employeePart}</Typography>
            <Typography>{"Boss : " + sums.bossPart}</Typography>
            <Divider />
            <br />
            <Typography>
              {"Dette Restant pour " +
                (employeeInfo.length !== 0
                  ? employeeInfo.firstName + " " + employeeInfo.lastName
                  : "") +
                " est :" +
                (parseFloat(debtSums.debtAmount) -
                  parseFloat(debtPaidSums.amountPaid))}
            </Typography>
            <Button
              variant="contained"
              color="info"
              endIcon={<Replay />}
              href="/paid-debt"
            >
              Reduire la dette
            </Button>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
};

export default Inventory;
