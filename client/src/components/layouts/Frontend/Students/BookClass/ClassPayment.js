import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import StudentNavbar from "../StudentNavbar";
import { Link, useHistory, useLocation } from "react-router-dom";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import Typography from "@mui/material/Typography";
import moment from "moment";
import {
  bookclass,
  checkClassIsAlreadyBookedOrNot,
} from "../../../../../actions/frontent";
import { useDispatch } from "react-redux";
import loader from "../../../loading.gif";
// import { styled} from '@mui/material/styles';
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { STRIPE_PUBLISHABLE_KEY } from "../../../../../actions/types";
import CircularProgress from "@mui/material/CircularProgress";

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

const ClassPayment = () => {
  const [showAlreadyBookedMessage, setShowAlreadyBookedMessage] =
    useState(false);
  const [apiHit, setApiHit] = useState(false);
  return (
    <Box>
      <StudentNavbar />
      <Container>
        <Grid container>
          {showAlreadyBookedMessage ? (
            <Grid
              item
              lg={5}
              md={7}
              sm={12}
              className="m-auto mt-4 StepsContentWrapper"
            >
              <Typography
                variant="h3"
                gutterBottom
                component="div"
                className="mb-3 text-danger"
                align="center"
              >
                This class is already booked by you.
              </Typography>
            </Grid>
          ) : (
            <Grid
              item
              lg={5}
              md={7}
              sm={12}
              className="m-auto mt-4 StepsContentWrapper"
            >
              <Typography
                variant="h3"
                gutterBottom
                component="div"
                className="mb-3"
                align="center"
              >
                {apiHit ? (
                  "Credit card details"
                ) : (
                  <CircularProgress color="primary" />
                )}
              </Typography>
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  setShowAlreadyBookedMessage={setShowAlreadyBookedMessage}
                  setApiHit={setApiHit}
                  apiHit={apiHit}
                />
              </Elements>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};
const CheckoutForm = ({ setShowAlreadyBookedMessage, setApiHit, apiHit }) => {
  const dispatch = useDispatch();

  const stripe = useStripe();
  const elements = useElements();
  const [loading, setloading] = useState(false);
  const [amount, setAmount] = useState(0);
  const history = useHistory();
  const queryParams = new URLSearchParams(window.location.search);
  //const amount = queryParams.get("amount");
  const class_id = queryParams.get("Class_Id");
  const class_date = queryParams.get("class_date");
  const start_time_of_class = queryParams.get("start_time_of_class");
  const class_end_time = queryParams.get("class_end_time");
  const on_demand_class = queryParams.get("on_demand_class");
  const [errors, setErrors] = useState({
    cardNumberElement: "",
    cardExpiryElement: "",
    cardCvcElement: "",
  });
  const handleSubmit = async (event) => {
    var errorExists = false;
    var errorObject = {
      cardNumberElement: "",
      cardExpiryElement: "",
      cardCvcElement: "",
    };
    setErrors(errorObject);
    event.preventDefault();
    var cardElement = elements.getElement(CardNumberElement);
    var expiryElement = elements.getElement(CardExpiryElement);
    var cvcElement = elements.getElement(CardCvcElement);
    if (cardElement._empty) {
      console.log("Card number is empty");
      errorObject.cardNumberElement = "Card number is empty";
      errorExists = true;
    }
    if (cardElement._invalid) {
      console.log("Card number is invalid");
      errorObject.cardNumberElement = "Card number is invalid";

      errorExists = true;
    }
    if (expiryElement._empty) {
      console.log("Expiry Date is empty");
      errorObject.cardExpiryElement = "Expiry Date is empty";

      errorExists = true;
    }
    if (expiryElement._invalid) {
      console.log("Expiry Date is invalid");
      errorObject.cardExpiryElement = "Expiry Date is invalid";

      errorExists = true;
    }
    if (cvcElement._empty) {
      console.log("CVC number is empty");
      errorObject.cardCvcElement = "CVC number is empty";

      errorExists = true;
    }
    if (cvcElement._invalid) {
      console.log("CVC number is invalid");
      errorObject.cardCvcElement = "CVC number is invalid";

      errorExists = true;
    }
    if (errorExists) {
      setErrors(errorObject);
    }
    if (!errorExists && amount && amount > 0) {
      console.log("reach");

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: "card",
        card: elements.getElement(CardNumberElement),
        card: elements.getElement(CardExpiryElement),
        card: elements.getElement(CardCvcElement),
      });
      console.log(paymentMethod);
      if (!error) {
        const { id } = paymentMethod;
        const formdata = {
          card_last_digits: paymentMethod?.card?.last4,
          card_type: paymentMethod?.card?.brand,
          amount: amount,
          class_id: class_id,
          start_time_of_class: moment(start_time_of_class, ["h:mm A"]).format(
            "HH:mm"
          ),
          class_end_time: moment(class_end_time, ["h:mm A"]).format("HH:mm"),
          class_date: class_date,
          on_demand_class: on_demand_class,
        };
        setloading(true);
        dispatch(bookclass(formdata)).then((res) => {
          if (res && res.success) {
            setloading(false);
            history.push({
              pathname: "/students/account-confirmation",
            });
          } else {
            setloading(false);
          }
        });
      } else {
        console.log("Form is not completed");
      }
    }
  };
  useEffect(() => {
    var availabilityDateForClass = `${new Date().getFullYear()}-${(
      "0" +
      new Date().getMonth() +
      1
    ).slice(-2)}-${("0" + new Date().getDate()).slice(-2)}`;
    dispatch(
      checkClassIsAlreadyBookedOrNot(availabilityDateForClass, class_id)
    ).then((res) => {
      if (res && res.success) {
        setAmount(res?.data?.classData?.price);
        setShowAlreadyBookedMessage(
          res?.data?.classDetailData.length > 0 ? true : false
        );
        setApiHit(true);
      }
    });
  }, []);

  return (
    apiHit && (
      <form onSubmit={(e) => handleSubmit(e)} className="card_stripe_form">
        <CardNumberElement
          className="style_txt_stripe"
          options={{
            style: {
              base: {
                color: "#212121",
                fontWeight: 500,
                fontFamily: "inherit",
                fontSize: "16px",
                fontSmoothing: "antialiased",

                "::placeholder": {
                  color: "#21212163",
                },
                ":-webkit-autofill": {
                  color: "#e39f48",
                },
              },
            },
          }}
        />
        {errors.cardNumberElement != "" && (
          <p className="text-danger">{errors.cardNumberElement}</p>
        )}
        <FormControl variant="standard" className="w-100 mb-2">
          <TextField
            sx={{ mb: 1 }}
            required
            fullWidth
            name="name"
            id="name"
            variant="standard"
            placeholder="Name on card"
            className="StepsFields card_name_stripe"
          />
        </FormControl>

        <CardExpiryElement
          options={{
            style: {
              base: {
                color: "#212121",
                fontWeight: 500,
                fontFamily: "inherit",
                fontSize: "16px",
                fontSmoothing: "antialiased",

                "::placeholder": {
                  color: "#21212163",
                },
                ":-webkit-autofill": {
                  color: "#e39f48",
                },
              },
            },
          }}
          className="style_txt_stripe"
        />
        {errors.cardExpiryElement != "" && (
          <p className="text-danger">{errors.cardExpiryElement}</p>
        )}

        <CardCvcElement
          options={{
            style: {
              base: {
                color: "#212121",
                fontWeight: 500,
                fontFamily: "inherit",
                fontSize: "16px",
                fontSmoothing: "antialiased",

                "::placeholder": {
                  color: "#21212163",
                },
                ":-webkit-autofill": {
                  color: "#e39f48",
                },
              },
            },
          }}
          className="style_txt_stripe"
        />
        {errors.cardCvcElement != "" && (
          <p className="text-danger">{errors.cardCvcElement}</p>
        )}

        {loading ? (
          <img
            src={loader}
            style={{ width: "174px", margin: "auto", marginLeft: "133px" }}
          />
        ) : (
          <input
            type="submit"
            className="paymentbtn stripe_payment_bttn"
            disabled={!stripe || !elements}
            name="Confirm Payment"
            style={{ cursor: "pointer", zIndex: "9999" }}
          />
        )}
      </form>
    )
  );
};

export default ClassPayment;
