/* eslint-disable react/no-unescaped-entities */
 import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import Header from "../charts/Header";
import {
  getAllEmployees,
  getRefundDebtByUserIdAndDatesMedthod
} from "../utils/apiFunctions";

const PaidDebtHistory = () => {

  const [employeesInfo, setEmployeesInfo] = useState([]);

  const [resultDateRangeAndUserIdChange, setResultDateRangeAndUserIdChange] = useState([]);
  const [errorMessageEmployees, setErrorMessageEmployees] = useState("");
  const [errorMessageSearchByDate, setErrorMessageSearchByDate] = useState("");
  const [isLoading, setIsLoading] = useState(true);


  const formatter = new Intl.DateTimeFormat("fr-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const [searchQuery, setSearchQuery] = useState({
    user_id: "",
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
  };

  useEffect(() => {
    getAllEmployees()
      .then((data) => {
        setEmployeesInfo(data);
      })
      .catch((error) => {
        setErrorMessageEmployees(error.message);
      });

    setTimeout(() => {
      setErrorMessageEmployees("");
    }, 5000);
  }, []);

  const handleEmployeeDebtPayedHistorySearch = async (e) => {
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
    getRefundDebtByUserIdAndDatesMedthod(
      searchQuery.user_id,
      searchQuery.startDate,
      searchQuery.endDate
    )
      .then((response) => { 
        setResultDateRangeAndUserIdChange(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const data = resultDateRangeAndUserIdChange,
    keys = ["amountPaid"], 
    sums = data.reduce(
      (r, o) => (keys.forEach((k) => (r[k] += o[k])), r),
      Object.fromEntries(keys.map((k) => [k, 0]))
    );

  const columns = [
    {
      field: "refunder.lastName",
      headerName: "Nom",
      width: 120,
      cellClassName: "name-column--cell",
      valueGetter: (value, row) => {
        return `${row.refunder.lastName}`;
      },
    },
    {
      field: "refunder.firstName",
      headerName: "Prenom",
      width: 120,
      cellClassName: "name-column--cell",
      valueGetter: (value, row) => {
        return `${row.refunder.firstName}`;
      },
    },

    {
      field: "refunder.otherNames",
      headerName: "Surnom",
      width: 120,
      cellClassName: "name-column--cell",
      valueGetter: (value, row) => {
        return `${row.refunder.otherNames}`;
      },
    },

    {
      field: "paidDate",
      headerName: "Date de remboursement de dette",
      width: 200,
      cellClassName: "name-column--cell",
      valueGetter: (value) => {
        if (!value) {
          return value;
        }
        return formatter.format(new Date(value));
      },
    },

    {
      field: "amountPaid",
      headerName: "Montant",
      width: 120,
      cellClassName: "name-column--cell",
    },

    {
      field: "details",
      headerName: "Commentaire sur remboursement de dette",
      width: 250,
      cellClassName: "name-column--cell",
    },

    {
      field: "responsible.firstName",
      headerName: "Prenom du responsable",
      width: 150,
      cellClassName: "name-column--cell",
      valueGetter: (value, row) => {
        return `${row.responsible.firstName}`;
      },
    },
    {
      field: "responsible.lastName",
      headerName: "Nom du responsable",
      width: 150,
      cellClassName: "name-column--cell",
      valueGetter: (value, row) => {
        return `${row.responsible.lastName}`;
      },
    },
  ];

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      margin={"auto"}
      width={"100%"}
      marginTop={2}
    >
      <Paper sx={{ padding: "32px" }} elevation={10}>
        <Card>
          <CardContent>
          <Grid container rowSpacing={1} columnSpacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <form onSubmit={handleEmployeeDebtPayedHistorySearch}>
                <Stack spacing={1} sx={{ mb: 2 }} direction={"row"}>
                  <TextField
                    label="Choisir le Coiffeur"
                    value={searchQuery.user_id}
                    onChange={handleInputChange}
                    name="user_id"
                    select
                    fullWidth
                    required
                  >
                    {employeesInfo.map((employeeInfos) => (
                      <MenuItem key={employeeInfos.id} value={employeeInfos.id}>
                        {employeeInfos.firstName + " " + employeeInfos.lastName}
                      </MenuItem>
                    ))}
                  </TextField>
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

                <Button
                  variant="contained"
                  color="secondary"
                  type="submit"
                  sx={{ mb: 2 }}
                >
                  Valider
                </Button>
              </form>
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12}>
              {isLoading ? (
                <p className="mt-4">Recherche l'historique des dettes....</p>
              ) : resultDateRangeAndUserIdChange ? (
                <Box m="20px">
                  <Header
                    title="Historique des dettes"
                    subtitle={`Dette paye dans cette periode specifie: ${sums.amountPaid}`}
                  />
                    {isLoading ? (
                      <div>Loading l'historique...</div>
                    ) : (
                      <>
                        <DataGrid
                          rows={resultDateRangeAndUserIdChange}
                          columns={columns}
                          components={{ Toolbar: GridToolbar }}
                          initialState={{
                            pagination: {
                              paginationModel: {
                                pageSize: 5,
                              },
                            },
                          }}
                          pageSizeOptions={[5]}
                          disableRowSelectionOnClick
                        />
                        {errorMessageEmployees && <div className="text-danger">{errorMessageEmployees}</div>}
                      </>
                    )}
                  </Box>
              ) : (
                <p className="mt-4">
                  Pas d'historique disponible sur les dates selectionnees.
                </p>
              )}
              {errorMessageSearchByDate && (
                <p className="text-danger">{errorMessageSearchByDate}</p>
              )}
            </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Paper>
    </Box>
  );
};
export default PaidDebtHistory