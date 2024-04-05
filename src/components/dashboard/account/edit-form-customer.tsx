import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import {UserGear} from "@phosphor-icons/react/dist/ssr/UserGear";
import TableBody from "@mui/material/TableBody";
import {PencilLine} from "@phosphor-icons/react";
import * as React from "react";
import Stack from "@mui/material/Stack";



export default function EditFormCustomer({initialData}): React.JSX.Element {
  return (
    <Stack spacing={3}>
      <Card>
        <Box sx={{overflowX: 'auto'}}>
          <Table sx={{minWidth: '600px'}}>
            <TableHead>
              <TableRow>
                <TableCell style={{width: '35%'}}>№№</TableCell>
                <TableCell style={{width: '55%'}}>Наименование</TableCell>
                <TableCell style={{width: '15%'}}><UserGear size={24}/></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell sx={{width: "35%"}}>Имя</TableCell>
                <TableCell sx={{width: "35%"}}>{initialData.v_AdditionalUserInfo[0].firstName}</TableCell>
                <TableCell sx={{width: "15%"}}><PencilLine size={20}/></TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{width: "35%"}}>Фамилия</TableCell>
                <TableCell sx={{width: "35%"}}>{initialData.v_AdditionalUserInfo[0].surName}</TableCell>
                <TableCell sx={{width: "15%"}}><PencilLine size={20}/></TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{width: "35%"}}>Телефон</TableCell>
                <TableCell sx={{width: "35%"}}>{initialData.v_AdditionalUserInfo[0].phone}</TableCell>
                <TableCell sx={{width: "15%"}}><PencilLine size={20}/></TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{width: "35%"}}>Телеграм</TableCell>
                <TableCell sx={{width: "35%"}}>{initialData.v_AdditionalUserInfo[0].telegram}</TableCell>
                <TableCell sx={{width: "15%"}}><PencilLine size={20}/></TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{width: "35%"}}>Должнсть</TableCell>
                <TableCell sx={{width: "35%"}}>{initialData.v_AdditionalUserInfo[0].position}</TableCell>
                <TableCell sx={{width: "15%"}}><PencilLine size={20}/></TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{width: "35%"}}>Организация</TableCell>
                <TableCell sx={{width: "35%"}}>{initialData.organization.name}</TableCell>
                <TableCell sx={{width: "15%"}}><PencilLine size={20}/></TableCell>
              </TableRow>
              <TableRow>
                <TableCell sx={{width: "35%"}}>Объекты</TableCell>
                <TableCell sx={{width: "35%"}}></TableCell>
                <TableCell sx={{width: "15%"}}><PencilLine size={20}/></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Box>
      </Card>
    </Stack>
  );
}


