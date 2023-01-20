from flask import Flask, render_template, request
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer             # to extraction text  
from sklearn.naive_bayes import MultinomialNB           # function he is responsible for (train and test ) process
from sklearn.model_selection import train_test_split      #to segmentation data for training and testing

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    df = pd.read_csv("spam.csv", encoding="latin-1")  #df name (data Frame)
    
    df.drop(['Unnamed: 2', 'Unnamed: 3', 'Unnamed: 4'], axis=1, inplace=True) #delete this rows from table
    # Features and Labels 
    df['label'] = df['class'].map({'ham': 0, 'spam': 1}) 
    X = df['message']  #Features
    y = df['label']     #Labels
    
    #--------------now data is ready to classifier----------------------------
    
    # Extract Feature With CountVectorizer
    cv = CountVectorizer()         # to extraction data 
    X = cv.fit_transform(X)  # Fit the Data    ||  to extraction data 
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.33, random_state=42)  ##to segmentation data for training and testing
    
    #training for training model   || test for performance model    (test_size : is 33% for testing   || andom_state : to be random)

    # Naive Bayes Classifier
    clf = MultinomialNB()
    clf.fit(X_train, y_train)    # function to he is train
    clf.score(X_test, y_test)     # function to test
    accuracy = clf.score(X_test, y_test)
    
    if request.method == 'POST':
        message = request.form['message']
        data = [message]
        vect = cv.transform(data).toarray()
        my_prediction = clf.predict(vect)
    return render_template('model.html', prediction=my_prediction)

@app.route('/')
def index() :
    return render_template('index.html')

@app.route('/allMessage')
def profile() :
    return render_template('allMessage.html')

@app.route('/model')
def model() :
    return render_template('model.html')



def method_name():
    pass
if __name__ == '__main__':
    app.run()