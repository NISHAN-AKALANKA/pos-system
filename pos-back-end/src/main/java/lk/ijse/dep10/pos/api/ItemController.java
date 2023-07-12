package lk.ijse.dep10.pos.api;

import lk.ijse.dep10.pos.dto.ItemDTO;
import lk.ijse.dep10.pos.dto.ResponseErrorDTO;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/items")
public class ItemController {

    @Autowired
    private BasicDataSource pool;

    @GetMapping("/{code}")
    public ResponseEntity<?> getItem(@PathVariable String code) {
        try (Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.prepareStatement("SELECT * FROM item WHERE code=?");
            stm.setString(1, code);
            ResultSet rst = stm.executeQuery();
            if (rst.next()){
                String description = rst.getString("description");
                int qty = rst.getInt("qty");
                BigDecimal unitPrice = rst.getBigDecimal("unit_price").setScale(2);
                ItemDTO item = new ItemDTO(code, description, qty, unitPrice);
                return new ResponseEntity<>(item, HttpStatus.OK);
            }else {
                ResponseErrorDTO error = new ResponseErrorDTO(404, "Item not found");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }
        } catch (SQLException e) {
            e.printStackTrace();
            ResponseErrorDTO error = new ResponseErrorDTO(500, "Failed to fetch the item, try again!");
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @GetMapping
    public ResponseEntity<?> getItems(@RequestParam(value = "q",required = false) String querry){
        if (querry == null)querry="";
        try (Connection connection =pool.getConnection()){
            PreparedStatement stm= connection.prepareStatement("SELECT * FROM item WHERE code LIKE ? OR description LIKE ? OR unit_price LIKE ? OR qty LIKE ? ");
            querry="%" + querry + "%";
            for (int i = 1; i <= 4; i++) {
                stm.setString(i,querry);
            }
            ResultSet rst = stm.executeQuery();
            List<ItemDTO> itemList = new ArrayList<>();
            while (rst.next()){
                String code = rst.getString("code");
                String description= rst.getString("description");
                BigDecimal price=rst.getBigDecimal("unit_price");
                int quantity=rst.getInt("qty");
                itemList.add(new ItemDTO(code,description, quantity, price));
            }
            HttpHeaders headers = new HttpHeaders();
            headers.add("X-Count",itemList.size()+"");
            return new ResponseEntity<>(itemList,headers,HttpStatus.OK);
        } catch (SQLException e) {
            e.printStackTrace();
            return new ResponseEntity<>(new ResponseErrorDTO(500, e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<?> saveCustomer(@RequestBody ItemDTO item){
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        try (Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.prepareStatement
                    ("INSERT INTO item (code,description, qty, unit_price) VALUES (?,?,?,?)",
                            Statement.RETURN_GENERATED_KEYS);
            stm.setString(1, item.getCode());
            stm.setString(2, item.getDescription());
            stm.setInt(3, item.getQty());
            stm.setBigDecimal(4, item.getUnitPrice());
            System.out.println(item.getUnitPrice());
            stm.executeUpdate();
            ResultSet generatedKeys = stm.getGeneratedKeys();
            generatedKeys.next();
//            String  code = generatedKeys.getString(1);
//            item.setCode(code);
            return new ResponseEntity<>(item, HttpStatus.CREATED);
        } catch (SQLException e) {
            if (e.getSQLState().equals("23000")){
                return new ResponseEntity<>(
                        new ResponseErrorDTO(HttpStatus.CONFLICT.value(),e.getMessage()),
                        HttpStatus.CONFLICT);
            }else{
                return new ResponseEntity<>(
                        new ResponseErrorDTO(500, e.getMessage()),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> updateItems(@PathVariable("id") int itemCode,
                                         @RequestBody ItemDTO item){
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
        try (Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.prepareStatement
                    ("UPDATE item SET description=?, qty=?, unit_price=? WHERE code=?");
            stm.setString(1, item.getDescription());
            stm.setInt(2, item.getQty());
            stm.setBigDecimal(3, item.getUnitPrice());
            stm.setInt(4, itemCode);
            int affectedRows = stm.executeUpdate();
            if (affectedRows == 1){
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }else {
                ResponseErrorDTO error = new ResponseErrorDTO(404, "Item ID not found");
                return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
            }
        } catch (SQLException e) {
            if (e.getSQLState().equals("23000")) {
                return new ResponseEntity<>(
                        new ResponseErrorDTO(HttpStatus.CONFLICT.value(), e.getMessage()),
                        HttpStatus.CONFLICT);
            } else {
                return new ResponseEntity<>(
                        new ResponseErrorDTO(500, e.getMessage()),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable("id") String itemId){
        try (Connection connection = pool.getConnection()) {
            PreparedStatement stm = connection.
                    prepareStatement("DELETE FROM item WHERE code=?");
            stm.setString(1, itemId);
            int affectedRows = stm.executeUpdate();
            if (affectedRows == 1){
                return new ResponseEntity<>(HttpStatus.NO_CONTENT);
            }else{
                ResponseErrorDTO response = new ResponseErrorDTO(404, "Item ID Not Found");
                return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
            }
        } catch (SQLException e) {
            if (e.getSQLState().equals("23000")) {
                return new ResponseEntity<>(
                        new ResponseErrorDTO(HttpStatus.CONFLICT.value(), e.getMessage()),
                        HttpStatus.CONFLICT);
            } else {
                return new ResponseEntity<>(
                        new ResponseErrorDTO(500, e.getMessage()),
                        HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }


}
