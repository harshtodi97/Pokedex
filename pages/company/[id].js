import axios from "axios";
import { useRouter } from "next/router";

const CompanyPage = ({ data, newSharePrices }) => {
  const router = useRouter();
  console.log(newSharePrices);

  if (router.isFallback) {
    return <div>loading</div>;
  }

  return (
    <>
      <div>hello</div>
    </>
    // <ul>
    //   {data.map((company) => (
    //     <li key='1'>hello</li>
    //   ))}
    // </ul>
  );
};

export const getStaticPaths = async () => {
  // const res = await fetch('https://.../posts')
  // const posts = await res.json()

  // const { data, error } = await supabaseAdmin
  //   .from("search_data")
  //   .select("stock_data")
  //   .match({ country_code: "IN" });

  const newArray = ["HDFCBANK.IN", "RELIANCE.IN"];

  // data.map((company) => {
  //   newArray.push(...company["stock_data"]);

  //   return newArray;
  // });

  const paths = newArray.map((company) => {
    // let countryCode;

    // if (company["Country"] === "USA") {
    //   countryCode = "US";
    // } else if (company["Country"] === "India") {
    //   countryCode = "IN";
    // }

    // const id = company["Code"] + "." + countryCode;

    return {
      params: { id: company },
    };
  });

  return { paths, fallback: true };
};

export const getStaticProps = async ({ params }) => {
  console.log(`Regenrating pokemon ${params.id}`);

  // const res = await fetch('https://.../posts')
  // const posts = await res.json()
  // console.log(params)
  const id = params.id;
  let data;
  let newSharePrices = [];

  await Promise.all([
    fetch(
      `https://eodhistoricaldata.com/api/fundamentals/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&filter=General,Highlights,Valuation,SharesStats,outstandingShares,Earnings`
    ),
    fetch(
      `https://eodhistoricaldata.com/api/fundamentals/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&filter=Financials::Balance_Sheet::yearly`
    ),
    fetch(
      `https://eodhistoricaldata.com/api/fundamentals/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&filter=Financials::Balance_Sheet::quarterly`
    ),
    fetch(
      `https://eodhistoricaldata.com/api/fundamentals/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&filter=Financials::Cash_Flow::yearly`
    ),
    fetch(
      `https://eodhistoricaldata.com/api/fundamentals/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&filter=Financials::Cash_Flow::quarterly`
    ),
    fetch(
      `https://eodhistoricaldata.com/api/fundamentals/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&filter=Financials::Income_Statement::yearly`
    ),
    fetch(
      `https://eodhistoricaldata.com/api/fundamentals/AAPL.US?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&filter=Financials::Income_Statement::quarterly`
    ),
  ])
    // await Promise.all([
    //   fetch(
    //     `https://eodhistoricaldata.com/api/fundamentals/${id}?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&filter=General,Highlights,Valuation,SharesStats,outstandingShares,Earnings`
    //   ),
    //   fetch(
    //     `https://eodhistoricaldata.com/api/fundamentals/${id}?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&filter=Financials::Balance_Sheet::yearly`
    //   ),
    //   fetch(
    //     `https://eodhistoricaldata.com/api/fundamentals/${id}?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&filter=Financials::Balance_Sheet::quarterly`
    //   ),
    //   fetch(
    //     `https://eodhistoricaldata.com/api/fundamentals/${id}?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&filter=Financials::Cash_Flow::yearly`
    //   ),
    //   fetch(
    //     `https://eodhistoricaldata.com/api/fundamentals/${id}?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&filter=Financials::Cash_Flow::quarterly`
    //   ),
    //   fetch(
    //     `https://eodhistoricaldata.com/api/fundamentals/${id}?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&filter=Financials::Income_Statement::yearly`
    //   ),
    //   fetch(
    //     `https://eodhistoricaldata.com/api/fundamentals/${id}?api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX&filter=Financials::Income_Statement::quarterly`
    //   ),
    // ])
    .then(async ([res1, res2, res3, res4, res5, res6, res7]) => {
      // let databaseInfo;
      const generalInfo = await res1.json();
      const balanceSheetYearlyComplete = await res2.json();
      const balanceSheetQuarterlyComplete = await res3.json();
      const cashFlowYearlyComplete = await res4.json();
      const cashFlowQuarterlyComplete = await res5.json();
      const incomeStatementYearlyComplete = await res6.json();
      const incomeStatementQuarterlyComplete = await res7.json();

      const balanceSheetQuarterly = {};
      const incomeStatementQuarterly = {};
      const cashFlowStatementQuarterly = {};
      const balanceSheetYearly = {};
      const incomeStatementYearly = {};
      const cashFlowStatementYearly = {};

      Object.keys(balanceSheetQuarterlyComplete)
        .slice(0, 20)
        .forEach((key) => {
          let value = balanceSheetQuarterlyComplete[key];
          balanceSheetQuarterly[key] = value;
        });
      Object.keys(cashFlowQuarterlyComplete)
        .slice(0, 20)
        .forEach((key) => {
          let value = cashFlowQuarterlyComplete[key];
          cashFlowStatementQuarterly[key] = value;
        });
      Object.keys(incomeStatementQuarterlyComplete)
        .slice(0, 20)
        .forEach((key) => {
          let value = incomeStatementQuarterlyComplete[key];
          incomeStatementQuarterly[key] = value;
        });
      Object.keys(balanceSheetYearlyComplete)
        .slice(0, 10)
        .forEach((key) => {
          let value = balanceSheetYearlyComplete[key];
          balanceSheetYearly[key] = value;
        });
      Object.keys(cashFlowYearlyComplete)
        .slice(0, 10)
        .forEach((key) => {
          let value = cashFlowYearlyComplete[key];
          cashFlowStatementYearly[key] = value;
        });
      Object.keys(incomeStatementYearlyComplete)
        .slice(0, 10)
        .forEach((key) => {
          let value = incomeStatementYearlyComplete[key];
          incomeStatementYearly[key] = value;
        });

      if (
        balanceSheetQuarterly &&
        incomeStatementQuarterly &&
        cashFlowStatementQuarterly &&
        balanceSheetYearly &&
        incomeStatementYearly &&
        cashFlowStatementYearly
      ) {
        // let result = false;

        const editData = () => {
          generalInfo["Financials"] = {
            Balance_Sheet: {
              quarterly: balanceSheetQuarterly,
              yearly: balanceSheetYearly,
            },
            Cash_Flow: {
              quarterly: cashFlowStatementQuarterly,
              yearly: cashFlowStatementYearly,
            },
            Income_Statement: {
              quarterly: incomeStatementQuarterly,
              yearly: incomeStatementYearly,
            },
          };
          data = generalInfo;
          // result = true;
        };

        editData();

        // if (result) {
        // if (true) {
        //   const date = new Date()
        //   console.log(date.toISOString())

        //   const { data, error } = await supabase
        //   .from("financial_data")
        //   .insert([
        //     {
        //       code: generalInfo.General["Code"] + "." + generalInfo.General["CountryISO"],
        //       data1: generalInfo,
        //       data2: balanceSheetQuarterly,
        //       data3: incomeStatementQuarterly,
        //       data4: cashFlowStatementQuarterly,
        //       data5: balanceSheetYearly,
        //       data6: incomeStatementYearly,
        //       data7: cashFlowStatementYearly,
        //     },

        //   ]);
        //   // const { data, error } = await supabaseAdmin
        //   // .from("financial_data")
        //   // .insert([
        //   //   {
        //   //     id: generalInfo.General["Code"] + "." + generalInfo.General["CountryISO"],
        //   //     inserted_at: date.toISOString(),
        //   //     country_code: generalInfo.General["CountryISO"],
        //   //     company_code: generalInfo.General["Code"],
        //   //     company_name: generalInfo.General["Name"],
        //   //     company_data: generalInfo,
        //   //   },
        //   // ]);

        //   // if (data) {
        //   //   databaseInfo = data;
        //   // }
        // } else {
        //   console.log("did not update database");
        // }
      }

      // res.status(200).json({ databaseInfo });
    })
    .catch((error) => {
      console.log(error);
      // res.status(400).json({ err });
    });

  await Promise.all([
    fetch(
      `https://eodhistoricaldata.com/api/eod/AAPL.US?fmt=json&from=2012-04-01&to=2013-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    ),
    fetch(
      `https://eodhistoricaldata.com/api/eod/AAPL.US?fmt=json&from=2013-04-01&to=2014-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    ),
    fetch(
      `https://eodhistoricaldata.com/api/eod/AAPL.US?fmt=json&from=2014-04-01&to=2015-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    ),
    fetch(
      `https://eodhistoricaldata.com/api/eod/AAPL.US?fmt=json&from=2015-04-01&to=2016-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    ),
    fetch(
      `https://eodhistoricaldata.com/api/eod/AAPL.US?fmt=json&from=2016-04-01&to=2017-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    ),
    fetch(
      `https://eodhistoricaldata.com/api/eod/AAPL.US?fmt=json&from=2017-04-01&to=2018-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    ),
    fetch(
      `https://eodhistoricaldata.com/api/eod/AAPL.US?fmt=json&from=2018-04-01&to=2019-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    ),
    fetch(
      `https://eodhistoricaldata.com/api/eod/AAPL.US?fmt=json&from=2019-04-01&to=2020-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    ),
    fetch(
      `https://eodhistoricaldata.com/api/eod/AAPL.US?fmt=json&from=2021-04-01&to=2022-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    ),
    fetch(
      `https://eodhistoricaldata.com/api/eod/AAPL.US?fmt=json&from=2022-04-01&to=2023-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    ),
  ])
    // await Promise.all([
    //   fetch(
    //     `https://eodhistoricaldata.com/api/eod/${id}?fmt=json&from=2012-04-01&to=2013-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    //   ),
    //   fetch(
    //     `https://eodhistoricaldata.com/api/eod/${id}?fmt=json&from=2013-04-01&to=2014-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    //   ),
    //   fetch(
    //     `https://eodhistoricaldata.com/api/eod/${id}?fmt=json&from=2014-04-01&to=2015-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    //   ),
    //   fetch(
    //     `https://eodhistoricaldata.com/api/eod/${id}?fmt=json&from=2015-04-01&to=2016-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    //   ),
    //   fetch(
    //     `https://eodhistoricaldata.com/api/eod/${id}?fmt=json&from=2016-04-01&to=2017-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    //   ),
    //   fetch(
    //     `https://eodhistoricaldata.com/api/eod/${id}?fmt=json&from=2017-04-01&to=2018-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    //   ),
    //   fetch(
    //     `https://eodhistoricaldata.com/api/eod/${id}?fmt=json&from=2018-04-01&to=2019-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    //   ),
    //   fetch(
    //     `https://eodhistoricaldata.com/api/eod/${id}?fmt=json&from=2019-04-01&to=2020-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    //   ),
    //   fetch(
    //     `https://eodhistoricaldata.com/api/eod/${id}?fmt=json&from=2021-04-01&to=2022-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    //   ),
    //   fetch(
    //     `https://eodhistoricaldata.com/api/eod/${id}?fmt=json&from=2022-04-01&to=2023-03-31&period=d&api_token=OeAFFmMliFG5orCUuwAKQ8l4WWFQ67YX`
    //   ),
    // ])
    .then(
      async ([res1, res2, res3, res4, res5, res6, res7, res8, res9, res10]) => {
        const sharePrices1 = await res1.json();
        const sharePrices2 = await res2.json();
        const sharePrices3 = await res3.json();
        const sharePrices4 = await res4.json();
        const sharePrices5 = await res5.json();
        const sharePrices6 = await res6.json();
        const sharePrices7 = await res7.json();
        const sharePrices8 = await res8.json();
        const sharePrices9 = await res9.json();
        const sharePrices10 = await res10.json();

        newSharePrices = [
          ...sharePrices1,
          ...sharePrices2,
          ...sharePrices3,
          ...sharePrices4,
          ...sharePrices5,
          ...sharePrices6,
          ...sharePrices7,
          ...sharePrices8,
          ...sharePrices9,
          ...sharePrices10,
        ];
      }
    )
    .catch((error) => {
      console.log(error);
      // res.status(400).json({ err });
    });

  return {
    props: {
      data,
      newSharePrices,
    },
    revalidate: 60, // In seconds
  };
};

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// the path has not been generated.

export default CompanyPage;
