import json
import requests
import numpy as np
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from reportlab.pdfgen import canvas
import os
from collections import defaultdict

script_dir = os.path.dirname(os.path.abspath(__file__))

load_dotenv()

USGS_API_KEY = os.getenv('USGS_API_KEY')



def fetch_and_process_data(site_code, pdf_path='usgs_report.pdf'):
    doc = SimpleDocTemplate(pdf_path, pagesize=letter)
    styles = getSampleStyleSheet()
    normal = styles['Normal']
    elements = []

    def p(text):
        elements.append(Paragraph(text, normal))
        elements.append(Spacer(1, 4))

    url = f'https://api.waterdata.usgs.gov/ogcapi/v0/collections/continuous/items?f=json&lang=en-US&limit=50000&properties=parameter_code,time,value&skipGeometry=true&offset=0&datetime=2025-03-01T00%3A00%3A00Z%2F2025-03-31T23%3A59%3A59Z&monitoring_location_id=USGS-{site_code}&parameter_code=00010%2C00301%2C00300%2C90860%2C00095%2C63680%2C00400&api_key={USGS_API_KEY}'
    response = requests.get(url)
    p(f"<b><font color='orange'>Fetching data from</font></b>: {url[0:30]}")

    grouped = defaultdict(list)


    if response.status_code == 200:
        data = json.loads(response.text)
        # test = data['value']['timeSeries'][0]
        # p(f"<b><font color='orange'>Status</font></b>: <font color='green'>Success</font>")
        # p(f"<b><font color='magenta'>Site Name</font></b>: {test['sourceInfo']['siteName']}")
        # p(f"<b><font color='magenta'>Site Code</font></b>: {site_code}")

        grouped = defaultdict(list)
        for feature in data['features']:
            code = feature["properties"]["parameter_code"]
            grouped[code].append(feature)
        for key, values in grouped.items():
            # variable = value[0]['properties']['variable']
            # variable_code = ', '.join([vc['value'] for vc in variable['variableCode']])
            # variable_name = variable['variableName']
            # variable_units = variable['unit']['unitCode']

            # p(f"<b><font color='black'>Variable Code</font></b>: {variable_code}")
            # p(f"<b><font color='black'>Variable Name</font></b>: {variable_name}")
            # p(f"<b><font color='black'>Variable Units</font></b>: {variable_units}")
            # print(values)
            # for value_entry in values:
            arr = []
            p(f'<b><font color="blue">Parameter Code</font></b>: {key}')
            p(f"<b><font color='black'>Number of Values</font></b>: {len(values)}")
            for value_entry in values:
                arr.append(float(value_entry["properties"]["value"]))

            cv = np.std(arr) / np.mean(arr)
            p(f"<b><font color='black'>Coefficient of Variation</font></b>: {cv:.3f}")

            if abs(cv) < 0.009:
                p(f"<b><font color='black'>Warning 1</font></b>: <font color='red'>Low variability</font>")
            else:
                p(f"<b><font color='black'>Warning 1</font></b>: <font color='green'>Valid variability</font>")

        # data_time_str = value_data['dateTime']
        # timestamp = dateutil.parser.isoparse(data_time_str)
        # now = datetime.now(timezone.utc).astimezone(timestamp.tzinfo)

        # difference = now - timestamp

        # # Check if it's 3 days old
        # if difference >= timedelta(days=3):
        #     p(f"<b><font color='black'>Warning 2</font></b>: <font color='red'>Old Timestamp</font> - last timestamp {difference.days} days old")
        # else:
        #     p(f"<b><font color='black'>Warning 2</font></b>: <font color='green'>Recent Timestamp</font> - last timestamp {difference.days} days old")

        # p(f"<b><font color='black'>Time Series Name</font></b>: {ts['name']}")
        p("<hr/>")
    else:
        p(f"<b><font color='orange'>Status</font></b>: <font color='red'>Failed</font>")
        p(f"HTTP Status Code: {response.status_code}")

    def set_pdf_metadata(canvas, doc):
        canvas.setTitle(site_code)

    doc.build(elements, onFirstPage=set_pdf_metadata)
    print(f"PDF report saved to {pdf_path}")

for site_code in ['01302020', '01376269', '01372043','0135980207','01359165','01374019','01376520','01376515']:
    pdf_path = os.path.join(script_dir, f'{site_code}_report_2.pdf')
    fetch_and_process_data(site_code, pdf_path=pdf_path)
